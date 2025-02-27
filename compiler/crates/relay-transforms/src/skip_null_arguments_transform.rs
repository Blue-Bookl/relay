/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

use graphql_ir::Argument;
use graphql_ir::ConstantValue;
use graphql_ir::Program;
use graphql_ir::Transformed;
use graphql_ir::Transformer;
use graphql_ir::Value;

/// Removes arguments with a `null` value. This replicates legacy Relay Compiler
/// behavior, but is not according to spec. Removing this would need some care
/// as there are small differences between not-passed and explicit null values wrt.
/// default values.
pub fn skip_null_arguments_transform(program: &Program) -> Program {
    SkipNullArgumentsTransform
        .transform_program(program)
        .replace_or_else(|| program.clone())
}

struct SkipNullArgumentsTransform;

impl Transformer<'_> for SkipNullArgumentsTransform {
    const NAME: &'static str = "SkipNullArgumentsTransform";
    const VISIT_ARGUMENTS: bool = true;
    const VISIT_DIRECTIVES: bool = true;

    fn transform_argument(&mut self, argument: &Argument) -> Transformed<Argument> {
        if matches!(argument.value.item, Value::Constant(ConstantValue::Null())) {
            Transformed::Delete
        } else {
            Transformed::Keep
        }
    }
}
