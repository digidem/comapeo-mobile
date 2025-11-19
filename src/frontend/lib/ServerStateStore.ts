import nodejs from '@comapeo/nodejs-mobile-react-native';
import type {StatusMessage} from '../../backend/src/status';
export type {StatusMessage as ServerState} from '../../backend/src/status';

export type ServerStateStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => StatusMessage;
};

export function createServerStateStore(): ServerStateStore {
  const listeners = new Set<() => void>();
  let serverStatusSubscription: {remove: () => void} | null = null;
  let serverState: StatusMessage = {
    value: 'STARTING',
  };

  function subscribeInternal() {
    if (serverStatusSubscription) return;
    // @ts-expect-error - incorrect types on nodejs.channel
    serverStatusSubscription = nodejs.channel.addListener(
      'server:status',
      (msg: StatusMessage) => {
        serverState = msg;
        listeners.forEach(listener => listener());
      },
    );
    // The backend will send a `'server:status'` message when it starts, but if
    // it started before the frontend (e.g. when react native reloads the
    // frontend), we need to tell it to re-send the status.
    nodejs.channel.post('get-server-status');
  }

  function unsubscribeInternal() {
    serverStatusSubscription?.remove();
    serverStatusSubscription = null;
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!serverStatusSubscription) subscribeInternal();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) unsubscribeInternal();
      };
    },
    getSnapshot() {
      return serverState;
    },
  };
}
