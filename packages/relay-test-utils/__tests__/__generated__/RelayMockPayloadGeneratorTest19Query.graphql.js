/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @oncall relay
 *
 * @generated SignedSource<<4dffe1ec42d010d729a03db3d0694699>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
import type { RelayMockPayloadGeneratorTest27Fragment$fragmentType } from "./RelayMockPayloadGeneratorTest27Fragment.graphql";
export type RelayMockPayloadGeneratorTest19Query$variables = {||};
export type RelayMockPayloadGeneratorTest19Query$data = {|
  +node: ?{|
    +$fragmentSpreads: RelayMockPayloadGeneratorTest27Fragment$fragmentType,
  |},
|};
export type RelayMockPayloadGeneratorTest19Query = {|
  response: RelayMockPayloadGeneratorTest19Query$data,
  variables: RelayMockPayloadGeneratorTest19Query$variables,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "my-id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RelayMockPayloadGeneratorTest19Query",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RelayMockPayloadGeneratorTest27Fragment"
          }
        ],
        "storageKey": "node(id:\"my-id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RelayMockPayloadGeneratorTest19Query",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Text",
                "kind": "LinkedField",
                "name": "body",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "text",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "actor",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v3/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "myActor",
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "actor",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v3/*: any*/)
                    ],
                    "type": "User",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Image",
                "kind": "LinkedField",
                "name": "profile_picture",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "uri",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "width",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "height",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "User",
            "abstractKey": null
          }
        ],
        "storageKey": "node(id:\"my-id\")"
      }
    ]
  },
  "params": {
    "cacheID": "a91aa25ab1823b0d4f7dc0aa218a8fe3",
    "id": null,
    "metadata": {},
    "name": "RelayMockPayloadGeneratorTest19Query",
    "operationKind": "query",
    "text": "query RelayMockPayloadGeneratorTest19Query {\n  node(id: \"my-id\") {\n    __typename\n    ...RelayMockPayloadGeneratorTest27Fragment\n    id\n  }\n}\n\nfragment RelayMockPayloadGeneratorTest24Fragment on User {\n  id\n  name\n}\n\nfragment RelayMockPayloadGeneratorTest25Fragment on User {\n  id\n  name\n  profile_picture {\n    ...RelayMockPayloadGeneratorTest26Fragment\n  }\n}\n\nfragment RelayMockPayloadGeneratorTest26Fragment on Image {\n  uri\n  width\n  height\n}\n\nfragment RelayMockPayloadGeneratorTest27Fragment on User {\n  body {\n    text\n  }\n  actor {\n    __typename\n    name\n    id\n  }\n  myActor: actor {\n    __typename\n    ...RelayMockPayloadGeneratorTest24Fragment\n    id\n  }\n  ...RelayMockPayloadGeneratorTest25Fragment\n}\n"
  }
};
})();

if (__DEV__) {
  (node/*: any*/).hash = "1c18a51722104d40fce836ccd865a96b";
}

module.exports = ((node/*: any*/)/*: Query<
  RelayMockPayloadGeneratorTest19Query$variables,
  RelayMockPayloadGeneratorTest19Query$data,
>*/);
