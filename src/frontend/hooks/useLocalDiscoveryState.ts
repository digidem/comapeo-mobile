import {type MapeoClientApi, type MapeoProjectApi} from '@mapeo/ipc';
import {
  AppState,
  AppStateStatus,
  type NativeEventSubscription,
} from 'react-native';
import NetInfo, {
  type NetInfoWifiState,
  type NetInfoState,
  type NetInfoDisconnectedStates,
  type NetInfoSubscription,
} from '@react-native-community/netinfo';
import StateMachine from 'start-stop-state-machine';
import {useApi} from '../contexts/ApiContext';
import {useSyncExternalStore} from 'react';

type LocalDiscoveryState = {
  /** Status of local peer discovery */
  status: 'stopped' | 'starting' | 'started' | 'stopping' | 'error';
  error?: Error;
  /** Name of WiFi SSID currently connected */
  ssid: string | null;
  /** Is the device WiFi turned on or off? */
  wifiStatus: 'unknown' | 'on' | 'off';
  /** Is the device connected to a WiFi network? */
  wifiConnection: 'unknown' | 'connected' | 'disconnected';
  /** Speed in Mbps of the WiFi connection (affects sync speed) */
  wifiLinkSpeed: number | null;
};

let localDiscoveryController: null | ReturnType<
  typeof createLocalDiscoveryController
> = null;

/**
 * Hook to subscribe to the current state of local peer discovery. Using this
 * hook at least once will ensure that local discovery is started and stopped as
 * wifi connects and the app becomes active or goes into the background.
 * Optionally pass a selector to subscribe to a subset of the state (to avoid
 * unnecessary re-renders)
 *
 * Creates a global singleton, to avoid duplicate start/stop comments and
 * minimize traffic over IPC - this hook can safely be used in more than one
 * place without attaching additional listeners across the IPC channel.
 *
 * @example
 * ```
 * const wifiLinkSpeed = useSync(state => state.wifiLinkSpeed);
 * ```
 *
 * @param selector Select a subset of the state to subscribe to. Defaults to
 * return the entire state. Be careful returning an object - if it's not the
 * same value (as compared by `Object.is`) as the previous value, the component
 * will re-render, e.g. a selector that does `return { status, ssid }` will
 * cause a re-render every time any state property updates, because it is
 * creating a new object every time.
 */
export function useLocalDiscoveryState(
  selector: (
    state: LocalDiscoveryState | undefined,
  ) =>
    | LocalDiscoveryState
    | LocalDiscoveryState[keyof LocalDiscoveryState] = state => state,
) {
  const api = useApi();
  if (!localDiscoveryController) {
    localDiscoveryController = createLocalDiscoveryController(api);
  }
  const {subscribe, getSnapshot} = localDiscoveryController;
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()));
}

function createLocalDiscoveryController(api: MapeoClientApi) {
  let appState = AppState.currentState;
  let netInfo: NetInfoWifiState | NetInfoDisconnectedStates | null = null;
  let netInfoSubscription: NetInfoSubscription | undefined;
  let appStateSubscription: NativeEventSubscription | undefined;
  let state: LocalDiscoveryState = {
    status: 'stopped',
    ssid: null,
    wifiStatus: 'unknown',
    wifiConnection: 'unknown',
    wifiLinkSpeed: null,
  };

  const sm = new StateMachine({
    start() {
      return api.startLocalPeerDiscovery();
    },
    stop() {
      return api.stopLocalPeerDiscovery();
    },
  });
  sm.on('state', state => {
    if (state.value === 'error') {
      updateState({status: 'error', error: state.error});
    } else {
      updateState({status: state.value});
    }
  });
  const listeners = new Set<() => void>();

  function subscribeInternal() {
    netInfoSubscription = NetInfo.addEventListener(onNetInfo);
    appStateSubscription = AppState.addEventListener('change', onAppState);
  }

  refreshWifiState();

  function refreshWifiState() {
    NetInfo.fetch('wifi').then(onNetInfo).catch(noop);
  }

  function updateState(newState: Partial<LocalDiscoveryState>) {
    if (shallowPartialEqual(state, newState)) return;
    // For React's useSyncExternalStore, getSnapshot needs to return a different
    // value (as compared by `Object.is`) when the state changes.
    state = {
      ...state,
      ...newState,
    };
    listeners.forEach(listener => listener());
  }

  function onNetInfo(nextNetInfo: NetInfoState) {
    if (state.status === 'error') return;
    if (nextNetInfo.type !== 'wifi') {
      // Currently NetInfo events fire with the active default data network. If
      // the phone is connected to WiFi, but the wifi connection has no
      // internet, and is also connected to cellular, with an active internet
      // connection, then the callback will fire with the cellular connection,
      // but we are interested in the wifi connection state, even if not
      // connected to the internet.
      refreshWifiState();
      return;
    }
    // Don't do anything if the app is not active (starting and stopping
    // discovery based on appState is handled below in onAppState)
    if (appState !== 'active') return;
    const nextIpAddress = nextNetInfo.details.ipAddress;
    const prevIpAddress = netInfo?.details ? netInfo.details.ipAddress : null;
    // netInfo.isConnected is true (I think) only if the wifi network has
    // internet access. We use the presence of an IP address to detect if wifi
    // is connected to a local network.
    const isLocalWifiConnected = !!nextIpAddress;

    const shouldDiscoveryBeStarted =
      isLocalWifiConnected &&
      (state.status === 'stopped' || state.status === 'stopping');

    const ipAddressChanged =
      nextIpAddress && prevIpAddress && nextIpAddress !== prevIpAddress;

    const ssidChanged =
      nextNetInfo.details.ssid &&
      netInfo?.details?.ssid &&
      nextNetInfo.details.ssid !== netInfo.details.ssid;

    const shouldDiscoveryRestart =
      (ipAddressChanged || ssidChanged) &&
      (state.status === 'starting' || state.status === 'started');

    const shouldDiscoveryBeStopped =
      !isLocalWifiConnected &&
      (state.status === 'starting' || state.status === 'started');
    if (shouldDiscoveryRestart) {
      // StartStopStateMachine will ensure these happen consecutively
      sm.stop().catch(noop);
      sm.start().catch(noop);
    } else if (shouldDiscoveryBeStarted) {
      sm.start().catch(noop);
    } else if (shouldDiscoveryBeStopped) {
      sm.stop().catch(noop);
    }
    netInfo = nextNetInfo;
    updateState({
      wifiStatus: nextNetInfo.isWifiEnabled ? 'on' : 'off',
      wifiConnection: isLocalWifiConnected ? 'connected' : 'disconnected',
      wifiLinkSpeed: nextNetInfo.details.linkSpeed,
      ssid: nextNetInfo.details.ssid,
    });
  }

  function onAppState(nextAppState: AppStateStatus) {
    if (nextAppState === 'active') {
      // If the app has just become active, we need to check if the wifi
      // connection has changed since the app was last active, and start or stop
      // discovery accordingly.
      refreshWifiState();
    } else {
      // If the app is not active, we need to stop discovery.
      sm.stop().catch(noop);
    }
    appState = nextAppState;
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!netInfoSubscription || !appStateSubscription) {
        subscribeInternal();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          netInfoSubscription?.();
          appStateSubscription?.remove();
          netInfoSubscription = undefined;
          appStateSubscription = undefined;
        }
      };
    },
    getSnapshot() {
      return state;
    },
  };
}

function noop() {}

function shallowPartialEqual<T extends {[k: string]: any}>(
  object: T,
  partial: Partial<T>,
) {
  for (const key in partial) {
    if (object[key] !== partial[key]) return false;
  }
  return true;
}
