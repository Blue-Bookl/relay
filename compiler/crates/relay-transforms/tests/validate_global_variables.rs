/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

use std::sync::Arc;

use common::SourceLocationKey;
use common::TextSource;
use fixture_tests::Fixture;
use graphql_cli::DiagnosticPrinter;
use graphql_ir::BuilderOptions;
use graphql_ir::FragmentVariablesSemantic;
use graphql_ir::Program;
use graphql_ir::RelayMode;
use graphql_ir::build_ir_with_extra_features;
use graphql_syntax::parse_executable;
use graphql_test_helpers::diagnostics_to_sorted_string;
use relay_test_schema::TEST_SCHEMA;
use relay_transforms::validate_global_variables;

pub async fn transform_fixture(fixture: &Fixture<'_>) -> Result<String, String> {
    let source_location = SourceLocationKey::standalone(fixture.file_name);

    let ast = parse_executable(fixture.content, source_location).unwrap();
    let ir_result = build_ir_with_extra_features(
        &TEST_SCHEMA,
        &ast.definitions,
        &BuilderOptions {
            allow_undefined_fragment_spreads: false,
            fragment_variables_semantic: FragmentVariablesSemantic::PassedValue,
            relay_mode: Some(RelayMode),
            default_anonymous_operation_name: None,
            allow_custom_scalar_literals: true, // for compatibility
        },
    );

    let ir = match ir_result {
        Ok(res) => res,
        Err(errors) => {
            let mut errs = errors
                .into_iter()
                .map(|err| {
                    let printer = DiagnosticPrinter::new(|_| {
                        Some(TextSource::from_whole_document(fixture.content.to_string()))
                    });
                    printer.diagnostic_to_string(&err)
                })
                .collect::<Vec<_>>();
            errs.sort();
            return Err(errs.join("\n\n"));
        }
    };

    let program = Program::from_definitions(Arc::clone(&TEST_SCHEMA), ir);
    validate_global_variables(&program)
        .map_err(|diagnostics| diagnostics_to_sorted_string(fixture.content, &diagnostics))?;

    Ok("OK".to_owned())
}
