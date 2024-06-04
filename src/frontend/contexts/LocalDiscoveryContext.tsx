import * as React from 'react';
import {AppState, AppStateStatus} from 'react-native';
import NetInfo, {
  type NetInfoWifiState,
  type NetInfoState,
  type NetInfoDisconnectedStates,
} from '@react-native-community/netinfo';
import StateMachine from 'start-stop-state-machine';
import Zeroconf, {type Service as ZeroconfService} from 'react-native-zeroconf';
import {type MapeoClientApi} from '@mapeo/ipc';
import noop from '../lib/noop';

type LocalDiscoveryController = ReturnType<
  typeof createLocalDiscoveryController
>;

export type LocalDiscoveryState = {
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

// Poll wifi state every 2 seconds
const POLL_WIFI_STATE_INTERVAL_MS = 2000;
const ZEROCONF_SERVICE_TYPE = 'comapeo';
const ZEROCONF_PROTOCOL = 'tcp';
const ZEROCONF_DOMAIN = 'local.';

const LocalDiscoveryContext = React.createContext<
  LocalDiscoveryController | undefined
>(undefined);

export type LocalDiscoveryProviderProps = {
  value: LocalDiscoveryController;
  children?: React.ReactNode;
};

export const LocalDiscoveryProvider = ({
  value,
  children,
}: LocalDiscoveryProviderProps): JSX.Element => {
  return (
    <LocalDiscoveryContext.Provider value={value}>
      {children}
    </LocalDiscoveryContext.Provider>
  );
};

export function useLocalDiscoveryController() {
  const value = React.useContext(LocalDiscoveryContext);
  if (!value) {
    throw new Error(
      'No LocalDiscoveryController set, use LocalDiscoveryProvider to set one',
    );
  }
  return value;
}

/**
 * Create a LocalDiscoveryController, which manages local peer discovery based
 * on the app state and wifi state. Local peer discovery starts when the app is
 * in the foreground and connected to a wifi network, and stops if the app goes
 * into the background or disconnects from a wifi network. It restarts if the
 * wifi network changes or the device IP address changes.
 *
 * Exposes, via getSnapshot(), the status of local peer discovery ('starting', 'started',
 * 'stopping', 'stopped', 'error'), and also the wifi status (on/off), network
 * SSID, wifi connection speed, and whether the device is connected to a wifi
 * network.
 *
 * Subscribe to changes in the state with subscribe(listener).
 */
export function createLocalDiscoveryController(mapeoApi: MapeoClientApi) {
  let appState = AppState.currentState;
  let netInfo: NetInfoWifiState | NetInfoDisconnectedStates | null = null;
  let unsubscribeInternal: undefined | (() => void);
  let state: LocalDiscoveryState = {
    status: 'stopped',
    ssid: null,
    wifiStatus: 'unknown',
    wifiConnection: 'unknown',
    wifiLinkSpeed: null,
  };
  let cancelNetInfoFetch: undefined | (() => void);
  const zeroconf = new Zeroconf();

  const sm = new StateMachine({
    async start() {
      const [{name, port}] = await Promise.all([
        mapeoApi.startLocalPeerDiscoveryServer(),
        startZeroconf(zeroconf),
      ]);
      zeroconf.publishService(
        ZEROCONF_SERVICE_TYPE,
        ZEROCONF_PROTOCOL,
        ZEROCONF_DOMAIN,
        name,
        port,
      );
    },
    async stop() {
      await Promise.all([
        mapeoApi.stopLocalPeerDiscoveryServer(),
        stopZeroconf(zeroconf),
      ]);
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

  /**
   * @param opts.pollWifiStateIntervalMs Optional interval in milliseconds to poll wifi state. Defaults to 2000ms.
   */
  function start({pollWifiStateIntervalMs = POLL_WIFI_STATE_INTERVAL_MS} = {}) {
    if (unsubscribeInternal) {
      throw new Error('LocalDiscoveryController already started');
    }
    const interval = setInterval(refreshWifiState, pollWifiStateIntervalMs);
    const removeNetInfoSub = NetInfo.addEventListener(onNetInfo);
    const {remove: removeAppStateSub} = AppState.addEventListener(
      'change',
      onAppState,
    );
    const onZeroconfResolved = (service: ZeroconfService) => {
      const peer = zeroconfServiceToMapeoPeer(service);
      if (peer) mapeoApi.connectPeer(peer);
    };
    zeroconf.on('resolved', onZeroconfResolved);
    unsubscribeInternal = function unsubscribe() {
      clearInterval(interval);
      removeNetInfoSub();
      removeAppStateSub();
      zeroconf.off('resolved', onZeroconfResolved);
    };
  }

  function stop() {
    if (!unsubscribeInternal) {
      throw new Error('LocalDiscoveryController not started');
    }
    unsubscribeInternal();
    unsubscribeInternal = undefined;
  }

  function refreshWifiState() {
    let cancel = false;
    cancelNetInfoFetch?.();
    cancelNetInfoFetch = () => {
      cancel = true;
    };
    NetInfo.fetch('wifi')
      .then(state => {
        if (cancel) return;
        onNetInfo(state);
      })
      .catch(noop);
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
    if (cancelNetInfoFetch) {
      cancelNetInfoFetch();
      cancelNetInfoFetch = undefined;
    }
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
      // StartStopStateMachine will ensure this happens after it is 'stopped'
      sm.start().catch(noop);
    } else if (shouldDiscoveryBeStopped) {
      // StartStopStateMachine will ensure this happens after it is 'started'
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
    appState = nextAppState;
    if (nextAppState === 'active') {
      // If the app has just become active, we need to check if the wifi
      // connection has changed since the app was last active, and start or stop
      // discovery accordingly.
      refreshWifiState();
    } else {
      // If the app is not active, we need to stop discovery.
      sm.stop().catch(noop);
    }
  }

  return {
    subscribe(listener: () => void) {
      if (!unsubscribeInternal) {
        throw new Error('LocalDiscoveryController not started');
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return state;
    },
    start,
    stop,
  };
}

function startZeroconf(zeroconf: Zeroconf): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      zeroconf.off('start', onStart);
      zeroconf.off('error', onError);
    };
    const onStart = () => {
      cleanup();
      resolve();
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    zeroconf.on('start', onStart);
    zeroconf.on('error', onError);

    zeroconf.scan(ZEROCONF_SERVICE_TYPE, ZEROCONF_PROTOCOL, ZEROCONF_DOMAIN);
  });
}

function stopZeroconf(zeroconf: Zeroconf): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      zeroconf.off('stop', onStop);
      zeroconf.off('error', onError);
    };
    const onStop = () => {
      cleanup();
      resolve();
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    zeroconf.on('stop', onStop);
    zeroconf.on('error', onError);

    zeroconf.stop();
  });
}

function zeroconfServiceToMapeoPeer({
  addresses,
  port,
  name,
}: Readonly<ZeroconfService>): null | {
  address: string;
  port: number;
  name: string;
} {
  const address = addresses[0];
  return address ? {address, port, name} : null;
}

function shallowPartialEqual<T extends {[k: string]: any}>(
  object: T,
  partial: Partial<T>,
) {
  for (const key in partial) {
    if (object[key] !== partial[key]) return false;
  }
  return true;
}
