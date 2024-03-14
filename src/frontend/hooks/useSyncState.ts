import {MapeoProjectApi} from '@mapeo/ipc';
import React from 'react';

import {useProject} from './server/projects';

type SyncState = Awaited<ReturnType<MapeoProjectApi['$sync']['getState']>>;

const projectSyncStoreMap = new WeakMap<MapeoProjectApi, SyncStore>();

function identity(state: SyncState | undefined) {
  return state;
}

function useSyncStore() {
  const project = useProject();

  let syncStore = projectSyncStoreMap.get(project);

  if (!syncStore) {
    syncStore = new SyncStore(project);
    projectSyncStoreMap.set(project, syncStore);
  }

  return syncStore;
}

/**
 * Hook to subscribe to the current sync state. Optionally pass a selector to
 * subscribe to a subset of the state (to avoid unnecessary re-renders)
 *
 * Creates a global singleton for each project, to minimize traffic over IPC -
 * this hook can safely be used in more than one place without attaching
 * additional listeners across the IPC channel.
 *
 * @example
 * ```
 * const connectedPeerCount = useSync(state => state.connectedPeers);
 * ```
 *
 * @param selector Select a subset of the state to subscribe to. Defaults to return the entire state.
 * @returns
 */
export function useSyncState<S = SyncState | undefined>(
  selector: (state: SyncState | undefined) => S = identity as any,
): S {
  const syncStore = useSyncStore();

  const {subscribe, getSnapshot} = syncStore;

  const getSelectorSnapshot = React.useCallback(
    () => selector(getSnapshot()),
    [selector, getSnapshot],
  );

  return React.useSyncExternalStore(subscribe, getSelectorSnapshot);
}

class SyncStore {
  #project: MapeoProjectApi;

  #listeners = new Set<() => void>();
  #isSubscribedInternal = false;
  #error: Error | undefined;

  #state: SyncState | undefined;

  constructor(project: MapeoProjectApi) {
    this.#project = project;
  }

  subscribe = (listener: () => void) => {
    this.#listeners.add(listener);
    if (!this.#isSubscribedInternal) this.#startSubscription();
    return () => {
      this.#listeners.delete(listener);
      if (this.#listeners.size === 0) this.#stopSubscription();
    };
  };

  getSnapshot = () => {
    if (this.#error) throw this.#error;
    return this.#state;
  };

  #onSyncState = (state: SyncState) => {
    this.#state = state;
    this.#error = undefined;
    this.#listeners.forEach(listener => listener());
  };

  #startSubscription = () => {
    this.#project.$sync.on('sync-state', this.#onSyncState);
    this.#isSubscribedInternal = true;
    this.#project.$sync
      .getState()
      .then(this.#onSyncState)
      .catch(e => {
        this.#error = e;
        this.#listeners.forEach(listener => listener());
      });
  };

  #stopSubscription = () => {
    this.#isSubscribedInternal = false;
    this.#project.$sync.off('sync-state', this.#onSyncState);
  };
}
