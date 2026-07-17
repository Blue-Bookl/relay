/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @oncall relay
 */

'use strict';

import type {ReaderFragment, RequestDescriptor} from 'relay-runtime';

const useRelayEnvironment = require('./useRelayEnvironment');
const invariant = require('invariant');
const React = require('react');
const {
  __internal: {getObservableForActiveRequest},
  RelayFeatureFlags,
  getSelector,
} = require('relay-runtime');

const {useEffect, useState, useMemo} = React;

// The two implementations below are selected by a feature flag at the top level
// rather than by branching inside a single hook body. `RelayFeatureFlags` is
// module-level config set once at app startup, so the branch is static for the
// lifetime of the component — it never flips between renders — which makes it
// safe to call the implementation hooks conditionally here (mirroring
// `useLoadMoreFunction`'s `ENABLE_ACTIVITY_COMPATIBILITY` split). Splitting this
// way fully isolates the new code path: when the flag is off, `_LEGACY` runs
// verbatim, so there is zero behavioral risk from the fix until it is rolled
// out.
hook useIsOperationNodeActive(
  fragmentNode: ReaderFragment,
  fragmentRef: unknown,
): boolean {
  if (RelayFeatureFlags.ENABLE_STABLE_OPERATION_NODE_ACTIVE_OBSERVABLE) {
    // $FlowFixMe[react-rule-hook] - the flag is static for the app lifetime
    // $FlowFixMe[react-rule-hook-conditional]
    return useIsOperationNodeActive_STABLE(fragmentNode, fragmentRef);
  }
  // $FlowFixMe[react-rule-hook] - the flag is static for the app lifetime
  // $FlowFixMe[react-rule-hook-conditional]
  return useIsOperationNodeActive_LEGACY(fragmentNode, fragmentRef);
}

// Legacy behavior, kept byte-for-byte so the flag-off path is unchanged.
hook useIsOperationNodeActive_LEGACY(
  fragmentNode: ReaderFragment,
  fragmentRef: unknown,
): boolean {
  const environment = useRelayEnvironment();
  const observable = useMemo(() => {
    const selector = getSelector(fragmentNode, fragmentRef);
    if (selector == null) {
      return null;
    }
    invariant(
      selector.kind === 'SingularReaderSelector',
      'useIsOperationNodeActive: Plural fragments are not supported.',
    );
    return getObservableForActiveRequest(environment, selector.owner);
  }, [environment, fragmentNode, fragmentRef]);
  const [isActive, setIsActive] = useState(observable != null);

  useEffect(() => {
    let subscription;
    setIsActive(observable != null);
    if (observable != null) {
      const onCompleteOrError = () => {
        setIsActive(false);
      };
      subscription = observable.subscribe({
        complete: onCompleteOrError,
        error: onCompleteOrError,
      });
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [observable]);

  return isActive;
}

// Fixed behavior: key the observable memo on `owner` (the request's
// RequestDescriptor) instead of on `fragmentRef`. `fragmentRef` is a wrapper
// that Relay re-materializes with a fresh identity on every render (a raw
// `environment.lookup` re-read), so keying on it recreated the Observable every
// render — each `getObservableForActiveRequest` call returns a fresh
// `Observable` — which re-ran the effect below and re-flipped `isActive` every
// render: a self-sustaining re-render loop that could exceed React's
// update-depth limit ("Maximum update depth exceeded") while a request stayed
// active. `owner`, by contrast, is stable across those re-reads (it maps to the
// query) and changes only when a new query is created — e.g. a refetch/reload —
// which is exactly when we do want a fresh Observable. The `owner` derivation is
// memoized so `getSelector` doesn't run every render in the steady state.
hook useIsOperationNodeActive_STABLE(
  fragmentNode: ReaderFragment,
  fragmentRef: unknown,
): boolean {
  const environment = useRelayEnvironment();
  const owner = useMemo((): ?RequestDescriptor => {
    const selector = getSelector(fragmentNode, fragmentRef);
    if (selector == null) {
      return null;
    }
    invariant(
      selector.kind === 'SingularReaderSelector',
      'useIsOperationNodeActive: Plural fragments are not supported.',
    );
    return selector.owner;
  }, [fragmentNode, fragmentRef]);
  const observable = useMemo(
    () =>
      owner != null ? getObservableForActiveRequest(environment, owner) : null,
    [environment, owner],
  );
  const [isActive, setIsActive] = useState(observable != null);

  useEffect(() => {
    let subscription;
    setIsActive(observable != null);
    if (observable != null) {
      const onCompleteOrError = () => {
        setIsActive(false);
      };
      subscription = observable.subscribe({
        complete: onCompleteOrError,
        error: onCompleteOrError,
      });
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [observable]);

  return isActive;
}

module.exports = useIsOperationNodeActive;
