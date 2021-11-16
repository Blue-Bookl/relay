/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated SignedSource<<7dd30816c84de7977c6d650fc8e2508f>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
type ReactRelayFragmentContainerWithFragmentOwnershipTestNestedUserFragment$fragmentType = any;
import type { FragmentType } from "relay-runtime";
declare export opaque type ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$fragmentType: FragmentType;
export type ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$ref = ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$fragmentType;
export type ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$data = {|
  +id: string,
  +name?: ?string,
  +$fragmentRefs: ReactRelayFragmentContainerWithFragmentOwnershipTestNestedUserFragment$fragmentType,
  +$fragmentSpreads: ReactRelayFragmentContainerWithFragmentOwnershipTestNestedUserFragment$fragmentType,
  +$refType: ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$fragmentType,
  +$fragmentType: ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$fragmentType,
|};
export type ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment = ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$data;
export type ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$key = {
  +$data?: ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$data,
  +$fragmentRefs: ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$fragmentType,
  +$fragmentSpreads: ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "cond"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "condition": "cond",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ]
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ReactRelayFragmentContainerWithFragmentOwnershipTestNestedUserFragment"
    }
  ],
  "type": "User",
  "abstractKey": null
};

if (__DEV__) {
  (node/*: any*/).hash = "a6f390ce39a0736709e18601023d1a20";
}

module.exports = ((node/*: any*/)/*: Fragment<
  ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$fragmentType,
  ReactRelayFragmentContainerWithFragmentOwnershipTestUserFragment$data,
>*/);
