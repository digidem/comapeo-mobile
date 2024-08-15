import {MapeoProjectApi} from '@mapeo/ipc';
import {useCallback, useSyncExternalStore} from 'react';

import {useActiveProject} from '../contexts/ActiveProjectContext';

// TODO: Temporary. Remove when sync api is updated
type SyncStateOld = Awaited<ReturnType<MapeoProjectApi['$sync']['getState']>>;

export type SyncState = {
  data: {
    isEnabled: boolean;
  };
  initial: {
    isEnabled: boolean;
  };
  deviceSyncState: Record<
    string,
    {
      data: Pick<SyncStateOld['data'], 'want' | 'wanted'> & {
        isEnabled: boolean;
      };
      initial: Pick<SyncStateOld['initial'], 'want' | 'wanted'> & {
        isEnabled: boolean;
      };
    }
  >;
};

const projectSyncStoreMap = new WeakMap<MapeoProjectApi, SyncStore>();

function useSyncStore() {
  const {projectApi} = useActiveProject();

  let syncStore = projectSyncStoreMap.get(projectApi);

  if (!syncStore) {
    syncStore = new SyncStore(projectApi);
    projectSyncStoreMap.set(projectApi, syncStore);
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

    // const currentCount = this.#state.data.want + this.#state.data.wanted;
    const currentCount = calculateSyncCount(this.#state.deviceSyncState);

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

  #onSyncState = (state: SyncStateOld) => {
    console.log('#onSyncState - state', JSON.stringify(state, null, 2));

    const convertedState = convertSyncState(state);

    console.log(
      '#onSyncState - converted state',
      JSON.stringify(convertedState, null, 2),
    );

    // Indicates whether data syncing went from enabled to disabled
    // const isDataSyncStopped =
    //   this.#state?.data.isSyncEnabled && !state.data.isSyncEnabled;
    const isDataSyncStopped =
      this.#state?.data.isEnabled && !convertedState.data.isEnabled;

    if (isDataSyncStopped) {
      this.#maxDataSyncCount = null;
    } else {
      // const newSyncCount = state.data.want + state.data.wanted;
      const newSyncCount = calculateSyncCount(convertedState.deviceSyncState);

      this.#maxDataSyncCount =
        this.#maxDataSyncCount === null
          ? newSyncCount
          : Math.max(this.#maxDataSyncCount, newSyncCount);
    }

    this.#state = convertedState;
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

export function calculateSyncCount(
  deviceSyncState: SyncState['deviceSyncState'],
): number {
  let result = 0;

  for (const {data, initial} of Object.values(deviceSyncState)) {
    result += initial.want + initial.wanted + data.want + data.wanted;
  }

  return result;
}

// TODO: Move to lib?
export function getConnectedPeersCount(
  deviceSyncState: SyncState['deviceSyncState'],
): number {
  return Object.keys(deviceSyncState).length;
}

// TODO: Move to lib?
export function getSyncingPeersCount(
  deviceSyncState: SyncState['deviceSyncState'],
): number {
  let result = 0;

  for (const {data} of Object.values(deviceSyncState)) {
    if (data.isEnabled) {
      result += 1;
    }
  }

  return result;
}

// TODO: Temporary. Remove when sync state api is updated
function convertSyncState(state: SyncStateOld): SyncState {
  const {initial, data} = state;
  return {
    initial: {
      isEnabled: initial.isSyncEnabled,
    },
    data: {
      isEnabled: data.isSyncEnabled,
    },
    // Currently just assumes one connected peer
    deviceSyncState: {
      peer_1: {
        initial: {
          want: initial.wanted,
          wanted: initial.want,
          isEnabled: true,
        },
        data: {
          want: data.wanted,
          wanted: data.want,
          isEnabled: true,
        },
      },
    },
  };
}
