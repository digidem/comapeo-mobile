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
 * Provides the progress of initial + data sync for SYNC-ENABLED connected peers
 *
 * @returns A number between 0 and 1 when data sync is enabled. `null` otherwise.
 */
export function useSyncProgress(): number | null {
  const {subscribe, getProgressSnapshot} = useSyncStore();
  return useSyncExternalStore(subscribe, getProgressSnapshot);
}

class SyncStore {
  #project: MapeoProjectApi;

  #listeners = new Set<() => void>();
  #isSubscribedInternal = false;
  #error: Error | null = null;
  #state: SyncState | null = null;

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

  // TODO: wondering if it would be easier for this to only return a number instead of number | null?
  getProgressSnapshot = () => {
    if (this.#state === null) {
      return null;
    }

    let currentSyncCount = 0;
    let totalMaxSyncCount = 0;

    for (const [deviceId, deviceSyncState] of Object.entries(
      this.#state.deviceSyncState,
    )) {
      const maxSyncCountForDevice = this.#perDeviceMaxSyncCount.get(deviceId);

      if (!maxSyncCountForDevice) continue;

      currentSyncCount = getTotalSyncCountForDevice(deviceSyncState);
      totalMaxSyncCount += maxSyncCountForDevice;
    }

    // TODO: I think this is the right thing to do here???
    if (totalMaxSyncCount === 0) {
      return 0;
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

  #onSyncState = (state: SyncStateOld) => {
    const dataSyncToggled =
      this.#state?.data.isEnabled !== state.data.isSyncEnabled;

    let convertedState = convertSyncState(state);

    // TODO: Temporary. only done for simulation purposes
    if (state.connectedPeers > 0) {
      convertedState = convertSyncState(state, {
        peer_1: {
          initial: {
            want: state.initial.wanted,
            wanted: state.initial.want,
            isEnabled: true,
          },
          data: {
            want: state.data.wanted,
            wanted: state.data.want,
            isEnabled: true,
          },
        },
      });
    }

    if (dataSyncToggled) {
      this.#perDeviceMaxSyncCount.clear();
    } else {
      const connectedDevices = Object.keys(convertedState.deviceSyncState);

      // Remove devices from #perDeviceMaxSyncCount that are no longer found in the new sync state
      for (const deviceId of this.#perDeviceMaxSyncCount.keys()) {
        if (!connectedDevices.includes(deviceId)) {
          this.#perDeviceMaxSyncCount.delete(deviceId);
        }
      }
    }

    // Add or update sync-enabled devices in #perDeviceMaxSyncCount based on new sync state
    for (const [deviceId, stateForDevice] of Object.entries(
      convertedState.deviceSyncState,
    )) {
      // Ignore devices that do not have data sync enabled
      // TODO: Would it be worth checking initial and data sync? (initial is technically always enabled)
      if (!stateForDevice.data.isEnabled) continue;

      const existingCount = this.#perDeviceMaxSyncCount.get(deviceId);
      const newCount = getTotalSyncCountForDevice(stateForDevice);

      if (existingCount === undefined) {
        this.#perDeviceMaxSyncCount.set(deviceId, newCount);
      } else {
        if (existingCount < newCount) {
          this.#perDeviceMaxSyncCount.set(deviceId, newCount);
        }
      }
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

function getTotalSyncCountForDevice(
  syncStateForDevice: SyncState['deviceSyncState'][string],
) {
  const {initial, data} = syncStateForDevice;
  return initial.want + initial.wanted + data.want + data.wanted;
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
function convertSyncState(
  state: SyncStateOld,
  deviceSyncState: SyncState['deviceSyncState'] = {},
): SyncState {
  const {initial, data} = state;
  return {
    initial: {
      isEnabled: initial.isSyncEnabled,
    },
    data: {
      isEnabled: data.isSyncEnabled,
    },
    // Currently just assumes one connected peer
    deviceSyncState,
  };
}
