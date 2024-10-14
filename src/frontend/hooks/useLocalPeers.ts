import {type MapeoClientApi} from '@comapeo/ipc';
import {useSyncExternalStore} from 'react';
import {useApi} from '../contexts/ApiContext';

type LocalPeer = Awaited<ReturnType<MapeoClientApi['listLocalPeers']>>[number];

let localPeerState: ReturnType<typeof createLocalPeerState> | undefined;

/**
 * @returns An array of local peers (includes peers that were previously connected but are no longer connected)
 */
export function useLocalPeers(): LocalPeer[] {
  const api = useApi();
  if (!localPeerState) {
    localPeerState = createLocalPeerState(api);
  }
  const {subscribe, getSnapshot} = localPeerState;
  return useSyncExternalStore(subscribe, getSnapshot);
}

function createLocalPeerState(api: MapeoClientApi) {
  let state: LocalPeer[] = [];
  let isSubscribedInternal = false;
  let error: Error | undefined;
  const peersById = new Map<string, LocalPeer>();
  const listeners = new Set<() => void>();

  function subscribeInternal() {
    isSubscribedInternal = true;
    api.on('local-peers', onPeers);
    api
      .listLocalPeers()
      .then(onPeers)
      .catch(err => {
        error = err;
        listeners.forEach(listener => listener());
      });
  }

  function unsubscribeInternal() {
    isSubscribedInternal = false;
    api.off('local-peers', onPeers);
  }

  function onPeers(peers: LocalPeer[]) {
    error = undefined;
    if (!isSubscribedInternal) return;
    let stateUpdated = false;
    for (const peer of peers) {
      const existing = peersById.get(peer.deviceId);
      const changed = !existing || !shallowEqual(existing, peer);
      if (changed) {
        peersById.set(peer.deviceId, peer);
        stateUpdated = true;
      }
    }
    if (stateUpdated) {
      state = Array.from(peersById.values());
      listeners.forEach(listener => listener());
    }
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!isSubscribedInternal) subscribeInternal();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) unsubscribeInternal();
      };
    },
    getSnapshot() {
      if (error) throw error;
      return state;
    },
  };
}

// TODO: Move into shared utils
function shallowEqual(a: any, b: any) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  for (const key in a) {
    if (!(key in b) || a[key] !== b[key]) return false;
  }
  for (const key in b) {
    if (!(key in a)) return false;
  }
  return true;
}
