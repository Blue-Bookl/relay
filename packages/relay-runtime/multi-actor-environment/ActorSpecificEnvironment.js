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

import type {HandlerProvider} from '../handlers/RelayDefaultHandlerProvider';
import type {GraphQLResponse, PayloadData} from '../network/RelayNetworkTypes';
import type {INetwork} from '../network/RelayNetworkTypes';
import type RelayObservable from '../network/RelayObservable';
import type {
  ExecuteMutationConfig,
  LogFunction,
  MissingFieldHandler,
  MutationParameters,
  OperationAvailability,
  OperationDescriptor,
  OperationTracker,
  OptimisticResponseConfig,
  OptimisticUpdateFunction,
  RelayFieldLogger,
  SelectorStoreUpdater,
  SingularReaderSelector,
  Snapshot,
  Store,
  StoreUpdater,
  TaskScheduler,
} from '../store/RelayStoreTypes';
import type {Disposable, RenderPolicy} from '../util/RelayRuntimeTypes';
import type {ActorIdentifier} from './ActorIdentifier';
import type {
  IActorEnvironment,
  IMultiActorEnvironment,
} from './MultiActorEnvironmentTypes';

const wrapNetworkWithLogObserver = require('../network/wrapNetworkWithLogObserver');
const defaultGetDataID = require('../store/defaultGetDataID');
const RelayOperationTracker = require('../store/RelayOperationTracker');
const RelayPublishQueue = require('../store/RelayPublishQueue');
const registerEnvironmentWithDevTools = require('../util/registerEnvironmentWithDevTools');

export type ActorSpecificEnvironmentConfig = $ReadOnly<{
  actorIdentifier: ActorIdentifier,
  configName: ?string,
  defaultRenderPolicy: RenderPolicy,
  handlerProvider: HandlerProvider,
  logFn: LogFunction,
  multiActorEnvironment: IMultiActorEnvironment,
  network: INetwork,
  relayFieldLogger: RelayFieldLogger,
  store: Store,
  missingFieldHandlers: $ReadOnlyArray<MissingFieldHandler>,
}>;

class ActorSpecificEnvironment implements IActorEnvironment {
  __log: LogFunction;
  +_defaultRenderPolicy: RenderPolicy;
  +_network: INetwork;
  +_operationTracker: OperationTracker;
  +_publishQueue: RelayPublishQueue;
  +_store: Store;
  +actorIdentifier: ActorIdentifier;
  +configName: ?string;
  +multiActorEnvironment: IMultiActorEnvironment;
  +options: mixed;
  relayFieldLogger: RelayFieldLogger;

  constructor(config: ActorSpecificEnvironmentConfig) {
    this.configName = config.configName;
    this.actorIdentifier = config.actorIdentifier;
    this.multiActorEnvironment = config.multiActorEnvironment;

    this.__log = config.logFn;
    this.relayFieldLogger = config.relayFieldLogger;
    this._operationTracker = new RelayOperationTracker();
    this._store = config.store;
    this._network = wrapNetworkWithLogObserver(this, config.network);
    this._publishQueue = new RelayPublishQueue(
      config.store,
      config.handlerProvider,
      defaultGetDataID,
      config.missingFieldHandlers,
      this.__log,
    );
    this._defaultRenderPolicy = config.defaultRenderPolicy;
    // TODO:T92305692 Remove `options` in favor of directly using `actorIdentifier` on the environment
    this.options = {
      actorID: this.actorIdentifier,
    };

    // We need to add this here to pass `isRelayModernEnvironment` check
    // $FlowFixMe[prop-missing]
    this['@@RelayModernEnvironment'] = true;

    if (__DEV__) {
      const {inspect} = require('../store/StoreInspector');
      (this: $FlowFixMe).DEBUG_inspect = (dataID: ?string) =>
        inspect(this, dataID);
    }

    // Register this Relay Environment with Relay DevTools if it exists.
    // Note: this must always be the last step in the constructor.
    registerEnvironmentWithDevTools(this);
  }

  getPublishQueue(): RelayPublishQueue {
    return this._publishQueue;
  }

  UNSTABLE_getDefaultRenderPolicy(): RenderPolicy {
    return this._defaultRenderPolicy;
  }

  applyMutation<TMutation: MutationParameters>(
    optimisticConfig: OptimisticResponseConfig<TMutation>,
  ): Disposable {
    return this.multiActorEnvironment.applyMutation(this, optimisticConfig);
  }

  applyUpdate(optimisticUpdate: OptimisticUpdateFunction): Disposable {
    return this.multiActorEnvironment.applyUpdate(this, optimisticUpdate);
  }

  revertUpdate(optimisticUpdate: OptimisticUpdateFunction): void {
    return this.multiActorEnvironment.revertUpdate(this, optimisticUpdate);
  }

  replaceUpdate(
    optimisticUpdate: OptimisticUpdateFunction,
    replacementUpdate: OptimisticUpdateFunction,
  ): void {
    return this.multiActorEnvironment.replaceUpdate(
      this,
      optimisticUpdate,
      replacementUpdate,
    );
  }

  check(operation: OperationDescriptor): OperationAvailability {
    return this.multiActorEnvironment.check(this, operation);
  }

  subscribe(
    snapshot: Snapshot,
    callback: (snapshot: Snapshot) => void,
  ): Disposable {
    return this.multiActorEnvironment.subscribe(this, snapshot, callback);
  }

  retain(operation: OperationDescriptor): Disposable {
    return this.multiActorEnvironment.retain(this, operation);
  }

  commitUpdate(updater: StoreUpdater): void {
    return this.multiActorEnvironment.commitUpdate(this, updater);
  }

  /**
   * Commit a payload to the environment using the given operation selector.
   */
  commitPayload(
    operationDescriptor: OperationDescriptor,
    payload: PayloadData,
  ): void {
    return this.multiActorEnvironment.commitPayload(
      this,
      operationDescriptor,
      payload,
    );
  }

  getNetwork(): INetwork {
    return this._network;
  }

  getStore(): Store {
    return this._store;
  }

  getOperationTracker(): OperationTracker {
    return this._operationTracker;
  }

  getScheduler(): ?TaskScheduler {
    return this.multiActorEnvironment.getScheduler();
  }

  lookup(selector: SingularReaderSelector): Snapshot {
    return this.multiActorEnvironment.lookup(this, selector);
  }

  execute(config: {
    operation: OperationDescriptor,
  }): RelayObservable<GraphQLResponse> {
    return this.multiActorEnvironment.execute(this, config);
  }

  executeSubscription<TMutation: MutationParameters>(config: {
    operation: OperationDescriptor,
    updater?: ?SelectorStoreUpdater<TMutation['response']>,
  }): RelayObservable<GraphQLResponse> {
    return this.multiActorEnvironment.executeSubscription(this, config);
  }

  executeMutation<TMutation: MutationParameters>(
    options: ExecuteMutationConfig<TMutation>,
  ): RelayObservable<GraphQLResponse> {
    return this.multiActorEnvironment.executeMutation(this, options);
  }

  executeWithSource(options: {
    operation: OperationDescriptor,
    source: RelayObservable<GraphQLResponse>,
  }): RelayObservable<GraphQLResponse> {
    return this.multiActorEnvironment.executeWithSource(this, options);
  }

  isRequestActive(requestIdentifier: string): boolean {
    return this.multiActorEnvironment.isRequestActive(this, requestIdentifier);
  }

  isServer(): boolean {
    return this.multiActorEnvironment.isServer();
  }
}

module.exports = ActorSpecificEnvironment;
