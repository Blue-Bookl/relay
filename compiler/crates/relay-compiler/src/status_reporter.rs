/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//! The status reporter module provides functionality for reporting the status of the Relay compiler.
//!
//! This module contains two implementations of the `StatusReporter` trait:
//! * `ConsoleStatusReporter`: Reports the status to the console using the `log` crate.
//! * `JSONStatusReporter`: Reports the status to a JSON file using the `serde_json` crate.
use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::SeqCst;

use common::Diagnostic;
use common::DiagnosticSeverity;
use graphql_cli::DiagnosticPrinter;
use log::error;
use log::info;
use log::warn;
use tokio::sync::Notify;

use crate::FsSourceReader;
use crate::SourceReader;
use crate::errors::BuildProjectError;
use crate::errors::Error;
use crate::source_for_location;

pub trait StatusReporter {
    fn build_starts(&self);
    fn build_completes(&self, diagnostics: &[Diagnostic]);
    fn build_errors(&self, error: &Error);
}

/// A no-op reporter used as a placeholder when the real reporter is being moved.
pub struct NoopStatusReporter;

impl StatusReporter for NoopStatusReporter {
    fn build_starts(&self) {}
    fn build_completes(&self, _diagnostics: &[Diagnostic]) {}
    fn build_errors(&self, _error: &Error) {}
}

/// Tracks build status to coordinate between the compiler daemon and clients.
///
/// This allows the client calling flush_to_disk to wait until
/// any ongoing build completes, ensuring artifacts are consistent.
///
/// The `is_building` flag starts as `true` to ensure the initial build is
/// waited for. It is cleared when the build completes or when no build is
/// needed, and set back to `true` when file changes are detected.
pub struct BuildStatus {
    is_building: AtomicBool,
    build_complete_notify: Notify,
}

impl BuildStatus {
    pub fn new() -> Self {
        Self {
            // Start with is_building=true to wait for the initial build
            is_building: AtomicBool::new(true),
            build_complete_notify: Notify::new(),
        }
    }

    /// Called when file changes are detected, before the build starts.
    pub fn changes_pending(&self) {
        self.is_building.store(true, SeqCst);
    }

    /// Called when pending changes were determined to not require a build.
    pub fn no_pending_changes(&self) {
        self.is_building.store(false, SeqCst);
        self.build_complete_notify.notify_waiters();
    }

    /// Called when a build completes (successfully or with errors)
    pub fn build_completed(&self) {
        self.is_building.store(false, SeqCst);
        self.build_complete_notify.notify_waiters();
    }

    /// Wait until no build is in progress
    pub async fn wait_for_idle(&self) {
        let notified = self.build_complete_notify.notified();
        if self.is_building.load(SeqCst) {
            info!("Build is currently in progress...");
            notified.await;
        }
    }
}

impl Default for BuildStatus {
    fn default() -> Self {
        Self::new()
    }
}

/// Format a single diagnostic for display with source context.
pub fn format_diagnostic(
    root_dir: &std::path::Path,
    source_reader: &dyn SourceReader,
    diagnostic: &Diagnostic,
) -> String {
    let printer = DiagnosticPrinter::new(|source_location| {
        source_for_location(root_dir, source_location, source_reader)
            .map(|source| source.to_text_source())
    });
    printer.diagnostic_to_string(diagnostic)
}

/// Format a build error into displayable messages with severity.
pub fn format_build_errors(
    root_dir: &std::path::Path,
    source_reader: &dyn SourceReader,
    is_multi_project: bool,
    error: &Error,
) -> Vec<(DiagnosticSeverity, String)> {
    let mut messages = match error {
        Error::DiagnosticsError { errors } => errors
            .iter()
            .map(|d| (d.severity(), format_diagnostic(root_dir, source_reader, d)))
            .collect(),
        Error::BuildProjectsErrors { errors } => errors
            .iter()
            .flat_map(|e| format_project_error(root_dir, source_reader, is_multi_project, e))
            .collect(),
        Error::Cancelled => {
            vec![(
                DiagnosticSeverity::INFORMATION,
                "Compilation cancelled due to new changes.".to_string(),
            )]
        }
        error => vec![(DiagnosticSeverity::ERROR, format!("{error}"))],
    };
    if !matches!(error, Error::Cancelled) {
        messages.push((DiagnosticSeverity::ERROR, "Compilation failed.".to_string()));
    }
    messages
}

fn format_project_error(
    root_dir: &std::path::Path,
    source_reader: &dyn SourceReader,
    is_multi_project: bool,
    error: &BuildProjectError,
) -> Vec<(DiagnosticSeverity, String)> {
    match error {
        BuildProjectError::ValidationErrors {
            errors,
            project_name,
        } => errors
            .iter()
            .map(|diagnostic| {
                let output = format_diagnostic(root_dir, source_reader, diagnostic);
                let formatted_output = match diagnostic.severity() {
                    DiagnosticSeverity::ERROR => {
                        if is_multi_project {
                            format!("Error in the project `{project_name}`: {output}")
                        } else {
                            format!("Error: {output}")
                        }
                    }
                    _ => {
                        if is_multi_project {
                            format!("In the project `{project_name}`: {output}")
                        } else {
                            output
                        }
                    }
                };

                (diagnostic.severity(), formatted_output)
            })
            .collect(),
        BuildProjectError::PersistErrors {
            errors,
            project_name,
        } => errors
            .iter()
            .map(|error| {
                let msg = if is_multi_project {
                    format!("Error in the project `{project_name}`: {error}")
                } else {
                    format!("Error: {error}")
                };
                (DiagnosticSeverity::ERROR, msg)
            })
            .collect(),
        _ => {
            vec![(DiagnosticSeverity::ERROR, format!("{error}"))]
        }
    }
}

pub struct ConsoleStatusReporter {
    source_reader: Box<dyn SourceReader + Send + Sync>,
    root_dir: PathBuf,
    is_multi_project: bool,
}

impl ConsoleStatusReporter {
    pub fn new(root_dir: PathBuf, is_multi_project: bool) -> Self {
        Self {
            root_dir,
            source_reader: Box::new(FsSourceReader),
            is_multi_project,
        }
    }

    fn print_by_severity(&self, severity: DiagnosticSeverity, output: String) {
        match severity {
            DiagnosticSeverity::ERROR => error!("{output}"),
            DiagnosticSeverity::WARNING => warn!("{output}"),
            DiagnosticSeverity::HINT => {
                // Opting to omit, not emit, hints in the CLI output.
            }
            _ => info!("{output}"),
        }
    }
}

impl StatusReporter for ConsoleStatusReporter {
    fn build_starts(&self) {}

    fn build_completes(&self, diagnostics: &[Diagnostic]) {
        for diagnostic in diagnostics {
            let output = format_diagnostic(&self.root_dir, self.source_reader.as_ref(), diagnostic);
            self.print_by_severity(diagnostic.severity(), output);
        }
        info!("Compilation completed.");
    }

    fn build_errors(&self, error: &Error) {
        let messages = format_build_errors(
            &self.root_dir,
            self.source_reader.as_ref(),
            self.is_multi_project,
            error,
        );
        for (severity, msg) in messages {
            self.print_by_severity(severity, msg);
        }
    }
}

pub struct JSONStatusReporter {
    path: Option<PathBuf>,
    base_reporter: Box<dyn StatusReporter + Send + Sync>,
}

impl JSONStatusReporter {
    pub fn new(
        path: Option<PathBuf>,
        base_reporter: Box<dyn StatusReporter + Send + Sync>,
    ) -> Self {
        Self {
            path,
            base_reporter,
        }
    }
}

impl StatusReporter for JSONStatusReporter {
    fn build_starts(&self) {}

    fn build_completes(&self, diagnostics: &[Diagnostic]) {
        match &self.path {
            Some(path) => {
                self.base_reporter.build_completes(diagnostics);
                let mut file = OpenOptions::new()
                    .write(true)
                    .create(true)
                    .truncate(true)
                    .open(path)
                    .unwrap();
                writeln!(
                    file,
                    "{{\"completed\":true,\"diagnostics\":{}}}",
                    serde_json::to_string(diagnostics).unwrap()
                )
                .unwrap();
            }
            None => {
                println!(
                    "{{\"completed\":true,\"diagnostics\":{}}}",
                    serde_json::to_string(diagnostics).unwrap()
                );
            }
        }
    }

    fn build_errors(&self, error: &Error) {
        match &self.path {
            Some(path) => {
                self.base_reporter.build_errors(error);

                let mut file = OpenOptions::new()
                    .write(true)
                    .create(true)
                    .truncate(true)
                    .open(path)
                    .unwrap();
                writeln!(
                    file,
                    "{{\"completed\":false,\"error\":{}}}",
                    serde_json::to_string(error).unwrap()
                )
                .unwrap();
            }
            None => {
                println!(
                    "{{\"completed\":false,\"error\":{}}}",
                    serde_json::to_string(error).unwrap()
                );
            }
        }
    }
}
