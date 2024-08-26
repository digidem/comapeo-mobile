import {useCallback, useSyncExternalStore} from 'react';
import {MapeoProjectApi} from '@mapeo/ipc';

import {useActiveProject} from '../contexts/ActiveProjectContext';
import {getDataSyncCountForDevice, type SyncState} from '../lib/sync';

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
 * Provides the progress of data sync for sync-enabled connected peers
 *
 * @returns `null` if no sync state events have been received. Otherwise returns a value between 0 and 1 (inclusive)
 */
export function useDataSyncProgress(): number | null {
  const {subscribe, getDataProgressSnapshot} = useSyncStore();
  return useSyncExternalStore(subscribe, getDataProgressSnapshot);
}

class SyncStore {
  #project: MapeoProjectApi;

  #listeners = new Set<() => void>();
  #isSubscribedInternal = false;
  #error: Error | null = null;
  #state: SyncState | null = null;

  // Used for calculating sync progress
  #perDeviceMaxSyncCount = new Map<string, number>();

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

  getDataProgressSnapshot = () => {
    if (this.#state === null) {
      return null;
    }

    let currentSyncCount = 0;
    let totalMaxSyncCount = 0;
    let otherEnabledDevicesExist = false;

    for (const [deviceId, deviceSyncState] of Object.entries(
      this.#state.remoteDeviceSyncState,
    )) {
      if (deviceSyncState.data.isSyncEnabled) {
        otherEnabledDevicesExist = true;
      } else {
        continue;
      }

      const existingMaxCount = this.#perDeviceMaxSyncCount.get(deviceId);

      if (typeof existingMaxCount === 'number' && existingMaxCount > 0) {
        currentSyncCount = getDataSyncCountForDevice(deviceSyncState);
        totalMaxSyncCount += existingMaxCount;
      }
    }

    if (!otherEnabledDevicesExist) {
      return null;
    }

    if (totalMaxSyncCount === 0) {
      return 1;
    }

    const ratio = (totalMaxSyncCount - currentSyncCount) / totalMaxSyncCount;

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
    const dataSyncWasEnabled = this.#state
      ? this.#state.data.isSyncEnabled
      : false;

    // Reset map keeping track of counts used for progress if data sync is toggled
    if (dataSyncWasEnabled !== state.data.isSyncEnabled) {
      this.#perDeviceMaxSyncCount.clear();
    } else {
      // Remove devices from #perDeviceMaxSyncCount that are no longer found in the new sync state
      for (const deviceId of this.#perDeviceMaxSyncCount.keys()) {
        if (!Object.hasOwn(state.remoteDeviceSyncState, deviceId)) {
          this.#perDeviceMaxSyncCount.delete(deviceId);
        }
      }
    }

    for (const [deviceId, stateForDevice] of Object.entries(
      state.remoteDeviceSyncState,
    )) {
      const existingCount = this.#perDeviceMaxSyncCount.get(deviceId);
      const newCount = getDataSyncCountForDevice(stateForDevice);

      if (existingCount === undefined || existingCount < newCount) {
        this.#perDeviceMaxSyncCount.set(deviceId, newCount);
      }
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
