import {MapeoProjectApi} from '@mapeo/ipc';
import React from 'react';
import {useProject} from './server/projects';

type SyncState = Awaited<ReturnType<MapeoProjectApi['$sync']['getState']>>;

const projectStateMap = new WeakMap<
  MapeoProjectApi,
  ReturnType<typeof createSyncState>
>();

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
  selector: (state: SyncState | undefined) => S = state => state as any,
): S {
  const project = useProject();
  let state = projectStateMap.get(project);
  if (!state) {
    state = createSyncState(project);
    projectStateMap.set(project, state);
  }
  const {subscribe, getSnapshot} = state;
  return React.useSyncExternalStore(subscribe, () => selector(getSnapshot()));
}

function createSyncState(project: MapeoProjectApi) {
  let state: SyncState | undefined;
  let isSubscribedInternal = false;
  const listeners = new Set<() => void>();
  let error: Error | undefined;

  function onSyncState(state: SyncState) {
    state = state;
    error = undefined;
    listeners.forEach(listener => listener());
  }

  function subscribeInternal() {
    project.$sync.on('sync-state', onSyncState);
    isSubscribedInternal = true;
    project.$sync
      .getState()
      .then(onSyncState)
      .catch(e => {
        error = e;
        listeners.forEach(listener => listener());
      });
  }

  function unsubscribeInternal() {
    isSubscribedInternal = false;
    project.$sync.off('sync-state', onSyncState);
  }

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      if (!isSubscribedInternal) subscribeInternal();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) unsubscribeInternal();
      };
    },
    getSnapshot: () => {
      if (error) throw error;
      return state;
    },
  };
}
