/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @oncall relay
 *
 * @generated SignedSource<<5bef053c1adfdb1ffa0313258be7e692>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
import type { ActorChangePoint } from "react-relay/multi-actor";
import type { RelayResponseNormalizerTestActorChangeFragment$fragmentType } from "./RelayResponseNormalizerTestActorChangeFragment.graphql";
export type RelayResponseNormalizerTestActorChangeWithAliasQuery$variables = {||};
export type RelayResponseNormalizerTestActorChangeWithAliasQuery$data = {|
  +viewer: ?{|
    +actor: ?ActorChangePoint<{|
      +actor_key: string,
      +$fragmentSpreads: RelayResponseNormalizerTestActorChangeFragment$fragmentType,
    |}>,
    +me: ?{|
      +name: ?string,
    |},
  |},
|};
export type RelayResponseNormalizerTestActorChangeWithAliasQuery = {|
  response: RelayResponseNormalizerTestActorChangeWithAliasQuery$data,
  variables: RelayResponseNormalizerTestActorChangeWithAliasQuery$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RelayResponseNormalizerTestActorChangeWithAliasQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": "me",
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": (v1/*: any*/),
            "storageKey": null
          },
          {
            "kind": "ActorChange",
            "alias": null,
            "name": "actor",
            "storageKey": null,
            "args": null,
            "fragmentSpread": {
              "args": null,
              "kind": "FragmentSpread",
              "name": "RelayResponseNormalizerTestActorChangeFragment"
            }
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RelayResponseNormalizerTestActorChangeWithAliasQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": "me",
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v0/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          {
            "kind": "ActorChange",
            "linkedField": {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "actor",
              "plural": false,
              "selections": [
                (v2/*: any*/),
                {
                  "kind": "InlineFragment",
                  "selections": (v1/*: any*/),
                  "type": "User",
                  "abstractKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "actor_key",
                  "storageKey": null
                },
                (v3/*: any*/)
              ],
              "storageKey": null
            }
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8d9706b47742c098b3900e2e529295a5",
    "id": null,
    "metadata": {},
    "name": "RelayResponseNormalizerTestActorChangeWithAliasQuery",
    "operationKind": "query",
    "text": "query RelayResponseNormalizerTestActorChangeWithAliasQuery {\n  viewer {\n    me: actor {\n      __typename\n      name\n      id\n    }\n    actor @fb_actor_change {\n      __typename\n      ...RelayResponseNormalizerTestActorChangeFragment\n      actor_key\n      id\n    }\n  }\n}\n\nfragment RelayResponseNormalizerTestActorChangeFragment on User {\n  name\n}\n"
  }
};
})();

if (__DEV__) {
  (node/*: any*/).hash = "8ae75ed6d55511537f85750f1ff71def";
}

module.exports = ((node/*: any*/)/*: Query<
  RelayResponseNormalizerTestActorChangeWithAliasQuery$variables,
  RelayResponseNormalizerTestActorChangeWithAliasQuery$data,
>*/);
