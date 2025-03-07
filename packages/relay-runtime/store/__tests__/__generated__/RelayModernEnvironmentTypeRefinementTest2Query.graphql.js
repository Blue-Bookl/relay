/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @oncall relay
 *
 * @generated SignedSource<<82d72327169930be140c163243815eb3>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
import type { RelayModernEnvironmentTypeRefinementTest3Fragment$fragmentType } from "./RelayModernEnvironmentTypeRefinementTest3Fragment.graphql";
export type RelayModernEnvironmentTypeRefinementTest2Query$variables = {||};
export type RelayModernEnvironmentTypeRefinementTest2Query$data = {|
  +userOrPage: ?{|
    +$fragmentSpreads: RelayModernEnvironmentTypeRefinementTest3Fragment$fragmentType,
  |},
|};
export type RelayModernEnvironmentTypeRefinementTest2Query = {|
  response: RelayModernEnvironmentTypeRefinementTest2Query$data,
  variables: RelayModernEnvironmentTypeRefinementTest2Query$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "abc"
  }
],
v1 = {
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
    "name": "RelayModernEnvironmentTypeRefinementTest2Query",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "userOrPage",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RelayModernEnvironmentTypeRefinementTest3Fragment"
          }
        ],
        "storageKey": "userOrPage(id:\"abc\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RelayModernEnvironmentTypeRefinementTest2Query",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "userOrPage",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "lastName",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  }
                ],
                "type": "Entity",
                "abstractKey": "__isEntity"
              }
            ],
            "type": "Page",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": "userOrPage(id:\"abc\")"
      }
    ]
  },
  "params": {
    "cacheID": "4cad077ec9ff5850ad98989d289e2847",
    "id": null,
    "metadata": {},
    "name": "RelayModernEnvironmentTypeRefinementTest2Query",
    "operationKind": "query",
    "text": "query RelayModernEnvironmentTypeRefinementTest2Query {\n  userOrPage(id: \"abc\") {\n    __typename\n    ...RelayModernEnvironmentTypeRefinementTest3Fragment\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment RelayModernEnvironmentTypeRefinementTest3Fragment on Page {\n  id\n  lastName\n  ...RelayModernEnvironmentTypeRefinementTest4Fragment\n}\n\nfragment RelayModernEnvironmentTypeRefinementTest4Fragment on Entity {\n  __isEntity: __typename\n  url\n}\n"
  }
};
})();

if (__DEV__) {
  (node/*: any*/).hash = "1fab375c7c967318ceb32778cf782bd9";
}

module.exports = ((node/*: any*/)/*: Query<
  RelayModernEnvironmentTypeRefinementTest2Query$variables,
  RelayModernEnvironmentTypeRefinementTest2Query$data,
>*/);
