/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 * @oncall relay
 */

'use strict';
import type ActorSpecificEnvironment from '../multi-actor-environment/ActorSpecificEnvironment';
import type RelayModernEnvironment from '../store/RelayModernEnvironment';
import type {
  LogRequestInfoFunction,
  OperationAvailability,
} from '../store/RelayStoreTypes';
import type {RequestParameters} from '../util/RelayConcreteNode';
import type {CacheConfig, Variables} from '../util/RelayRuntimeTypes';
import type {
  GraphQLResponse,
  INetwork,
  UploadableMap,
  preprocessResponseFunction,
} from './RelayNetworkTypes';
import type RelayObservable from './RelayObservable';
import type {Subscription} from './RelayObservable';

const generateID = require('../util/generateID');

/**
 * Wraps the network with logging to ensure that network requests are
 * always logged. Relying on each network callsite to be wrapped is
 * untenable and will eventually lead to holes in the logging.
 * NOTE: This function takes an environment instance, because Relay
 * devtools will mutate the `env.__log` method, and the devtools rely
 * on it to receive network events.
 */
function wrapNetworkWithLogObserver(
  env: RelayModernEnvironment | ActorSpecificEnvironment,
  network: INetwork,
): INetwork {
  return {
    execute(
      params: RequestParameters,
      variables: Variables,
      cacheConfig: CacheConfig,
      uploadables?: ?UploadableMap,
      _?: ?LogRequestInfoFunction,
      encryptedVariables?: ?string,
      preprocessResponse?: ?preprocessResponseFunction,
      checkOperation?: () => OperationAvailability,
    ): RelayObservable<GraphQLResponse> {
      const networkRequestId = generateID();
      const logObserver = {
        start: (subscription: Subscription) => {
          env.__log({
            name: 'network.start',
            networkRequestId,
            params,
            variables,
            cacheConfig,
          });
        },
        next: (response: GraphQLResponse) => {
          env.__log({
            name: 'network.next',
            networkRequestId,
            response,
          });
        },
        error: (error: Error) => {
          env.__log({
            name: 'network.error',
            networkRequestId,
            error,
          });
        },
        complete: () => {
          env.__log({
            name: 'network.complete',
            networkRequestId,
          });
        },
        unsubscribe: () => {
          env.__log({
            name: 'network.unsubscribe',
            networkRequestId,
          });
        },
      };
      const logRequestInfo = (info: mixed) => {
        env.__log({
          name: 'network.info',
          networkRequestId,
          info,
        });
      };
      return network
        .execute(
          params,
          variables,
          cacheConfig,
          uploadables,
          logRequestInfo,
          encryptedVariables,
          preprocessResponse,
          checkOperation,
        )
        .do(logObserver);
    },
  };
}

module.exports = wrapNetworkWithLogObserver;
