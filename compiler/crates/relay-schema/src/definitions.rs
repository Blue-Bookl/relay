/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

use common::NamedItem;
use docblock_shared::RELAY_RESOLVER_MODEL_DIRECTIVE_NAME;
use docblock_shared::RELAY_RESOLVER_MODEL_INSTANCE_FIELD;
use docblock_shared::RELAY_RESOLVER_WEAK_OBJECT_DIRECTIVE;
use intern::string_key::StringKey;
use schema::FieldID;
use schema::Schema;
use schema::Type;

pub trait ResolverType {
    fn is_resolver_object<S: Schema>(&self, schema: &S) -> bool;
    fn is_weak_resolver_object<S: Schema>(&self, schema: &S) -> bool;
    fn is_terse_resolver_object<S: Schema>(&self, schema: &S) -> bool;
}

/// If `type_` is an `@weak` resolver model object, return its single
/// model-instance field (`__relay_model_instance`) — the field a reader uses to
/// read the weak value inline (no DataID pointer). Returns `None` for anything
/// that is not an `@weak` object.
///
/// This is the one place that resolves the weak object's instance field, shared
/// by `field_transform` (routing a weak return to the inline `Composite` arm)
/// and `client_edges` (per-implementor weak classification).
pub fn weak_object_instance_field<S: Schema>(schema: &S, type_: Type) -> Option<FieldID> {
    let Type::Object(object_id) = type_ else {
        return None;
    };
    let object = schema.object(object_id);
    object
        .directives
        .named(*RELAY_RESOLVER_WEAK_OBJECT_DIRECTIVE)?;
    // A weak object is expected to have exactly one field, the magic
    // `__relay_model_instance` field.
    object.fields.first().copied()
}

/// Returns `true` when `type_` is a non-Node SERVER VALUE object — a server
/// (non-extension) `Object` that does not implement `Node` (has no
/// `id_field_name` field) and is not an `@weak` model.
///
/// A server value type normalizes to `client:<parentid>:<field>` and has no
/// global id and no separate record to refetch. When such a type is the return
/// of a shadow (`@returnFragment`) resolver it must be read INLINE in place off
/// the transplanted record via its `__id` (the DataID/store key), rather than
/// routed to the strong `EdgeTo` pointer arm (which assumes an `id` field) or the
/// `@weak` model-instance arm.
///
/// This is the single place that classifies "server value type", shared by the
/// docblock schema validation (which must allow such a return past the
/// `@outputType`/weak check) and `field_transform` (which routes it to the
/// read-in-place inline arm). `id_field_name` is the project's
/// `node_interface_id_field` so the Node check honors a custom id field name.
pub fn is_server_value_object<S: Schema>(
    schema: &S,
    type_: Type,
    id_field_name: StringKey,
) -> bool {
    let Type::Object(object_id) = type_ else {
        return false;
    };
    // A client-extension object (e.g. a `@weak` model or any client type) is not
    // a server value type; those are handled by the weak / model arms.
    if schema.is_extension_type(type_) {
        return false;
    }
    let object = schema.object(object_id);
    // A Node / strong server object exposes an `id` field and is read via the
    // strong pointer arm; a value type has no `id`.
    let has_id_field = object
        .fields
        .iter()
        .any(|field_id| schema.field(*field_id).name.item == id_field_name);
    !has_id_field
}

/// Returns `true` when a resolver is a shadow (`@returnFragment`) resolver whose
/// return type is a non-Node SERVER VALUE object — i.e. the READ-IN-PLACE arm.
///
/// This is the SINGLE source of truth for the compound policy "the return is a
/// magic fragment AND the returned type is a server value type". The server-value
/// arm and the plain `@outputType` arm both collapse to the same
/// `ResolverOutputTypeInfo::Composite` metadata (no `weak_object_instance_field`),
/// so every site that must tell them apart — `field_transform` (route to the
/// inline `Composite` arm), `build_ast` (emit `ServerWeak` `normalizationInfo`
/// with no `normalizationNode`), `generate_relay_resolvers_operations_for_nested_objects`
/// (skip generating a normalization operation), and `relay-typegen`'s `visit`
/// (emit a `{__typename, __id}` identity return type instead of a dangling
/// `$normalization` import) — calls this one helper.
///
/// `has_return_fragment` is supplied by the caller because the magic-fragment
/// marker is reachable via different shapes at each site (resolver metadata vs.
/// the `@relayResolver`/`@returnFragment` directive argument). `id_field_name` is
/// the project's `node_interface_id_field`.
pub fn is_server_weak_shadow_return<S: Schema>(
    schema: &S,
    type_: Type,
    id_field_name: StringKey,
    has_return_fragment: bool,
) -> bool {
    has_return_fragment && is_server_value_object(schema, type_, id_field_name)
}

impl ResolverType for Type {
    fn is_resolver_object<S: Schema>(&self, schema: &S) -> bool {
        if let Type::Object(object_id) = self {
            let object = schema.object(*object_id);
            object
                .directives
                .named(*RELAY_RESOLVER_MODEL_DIRECTIVE_NAME)
                .is_some()
        } else {
            false
        }
    }

    fn is_weak_resolver_object<S: Schema>(&self, schema: &S) -> bool {
        weak_object_instance_field(schema, *self).is_some()
    }

    fn is_terse_resolver_object<S: Schema>(&self, schema: &S) -> bool {
        if let Type::Object(object_id) = self {
            let object = schema.object(*object_id);
            object.fields.iter().any(|field_id| {
                schema.field(*field_id).name.item == *RELAY_RESOLVER_MODEL_INSTANCE_FIELD
            })
        } else {
            false
        }
    }
}
