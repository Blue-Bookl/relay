/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated SignedSource<<99c54d954a3bc9d08cbe430e1dad26ba>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentType } from "relay-runtime";
declare export opaque type FragmentResourceTest6Fragment$fragmentType: FragmentType;
export type FragmentResourceTest6Fragment$ref = FragmentResourceTest6Fragment$fragmentType;
export type FragmentResourceTest6Fragment$data = {|
  +id: string,
  +name: ?string,
  +$refType: FragmentResourceTest6Fragment$fragmentType,
  +$fragmentType: FragmentResourceTest6Fragment$fragmentType,
|};
export type FragmentResourceTest6Fragment = FragmentResourceTest6Fragment$data;
export type FragmentResourceTest6Fragment$key = {
  +$data?: FragmentResourceTest6Fragment$data,
  +$fragmentRefs: FragmentResourceTest6Fragment$fragmentType,
  +$fragmentSpreads: FragmentResourceTest6Fragment$fragmentType,
  ...
};
*/

var node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FragmentResourceTest6Fragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

if (__DEV__) {
  (node/*: any*/).hash = "26deeac9ed39ae31bf668919ae1ed5ad";
}

module.exports = ((node/*: any*/)/*: Fragment<
  FragmentResourceTest6Fragment$fragmentType,
  FragmentResourceTest6Fragment$data,
>*/);
