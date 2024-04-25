import {MapeoProjectApi} from '@mapeo/ipc';
import {useCallback, useSyncExternalStore} from 'react';

import {useProject} from './server/projects';

export type SyncState = Awaited<
  ReturnType<MapeoProjectApi['$sync']['getState']>
>;

const projectSyncStoreMap = new WeakMap<MapeoProjectApi, SyncStore>();

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
export function useSyncState<S = SyncState | null>(
  selector: (state: SyncState | null) => S = identity as any,
): S {
  const syncStore = useSyncStore();

  const {subscribe, getStateSnapshot} = syncStore;

  const getSelectorSnapshot = useCallback(
    () => selector(getStateSnapshot()),
    [selector, getStateSnapshot],
  );

  return useSyncExternalStore(subscribe, getSelectorSnapshot);
}

/**
 * Calculates progress of *data* sync based on sync state.
 *
 * @returns A number between 0 and 1 when data sync is enabled. `null` otherwise.
 */
export function useSyncProgress() {
  const {subscribe, getProgressSnapshot} = useSyncStore();
  return useSyncExternalStore(subscribe, getProgressSnapshot);
}

class SyncStore {
  #project: MapeoProjectApi;

  #listeners = new Set<() => void>();
  #isSubscribedInternal = false;
  #error: Error | null = null;
  #state: SyncState | null = null;

  /**
   * Represents maximum value of `#state.data.want + #state.data.wanted` while data syncing is enabled.
   * Resets to null when data syncing goes from enabled to disabled.
   */
  #maxDataSyncCount: number | null = null;

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

  getStateSnapshot = () => {
    if (this.#error) throw this.#error;
    return this.#state;
  };

  getProgressSnapshot = () => {
    if (this.#maxDataSyncCount === null || this.#state === null) {
      return null;
    }

    if (this.#maxDataSyncCount === 0) {
      return 1;
    }

    const currentCount = this.#state.data.want + this.#state.data.wanted;

    const ratio =
      (this.#maxDataSyncCount - currentCount) / this.#maxDataSyncCount;

    if (ratio <= 0) return 0;
    if (ratio >= 1) return 1;

    return clamp(ratio, 0.01, 0.99);
  };

  #notifyListeners() {
    for (const listener of this.#listeners) {
      listener();
    }
  }

  #onSyncState = (state: SyncState) => {
    // Indicates whether data syncing went from enabled to disabled
    const isDataSyncStopped = this.#state?.data.syncing && !state.data.syncing;

    if (isDataSyncStopped) {
      this.#maxDataSyncCount = null;
    } else {
      const newSyncCount = state.data.want + state.data.wanted;

      this.#maxDataSyncCount =
        this.#maxDataSyncCount === null
          ? newSyncCount
          : Math.max(this.#maxDataSyncCount, newSyncCount);
    }

    this.#state = state;
    this.#error = null;
    this.#notifyListeners();
  };

  #startSubscription = () => {
    this.#project.$sync.on('sync-state', this.#onSyncState);
    this.#isSubscribedInternal = true;
    this.#project.$sync
      .getState()
      .then(this.#onSyncState)
      .catch(e => {
        this.#error = e;
        this.#notifyListeners();
      });
  };

  #stopSubscription = () => {
    this.#isSubscribedInternal = false;
    this.#project.$sync.off('sync-state', this.#onSyncState);
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function identity(state: SyncState | undefined) {
  return state;
}
