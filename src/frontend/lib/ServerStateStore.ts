import nodejs from 'nodejs-mobile-react-native';
import type {StatusMessage} from '../../backend/src/status';
import {createStore, type StoreApi} from 'zustand';
export type {StatusMessage as ServerState} from '../../backend/src/status';

export type ServerStateStore = StoreApi<StatusMessage>;

function createInitialState(): StatusMessage {
  return {
    value: 'STARTING',
  };
}

export function createServerStateStore() {
  const store = createStore(createInitialState);

  // We start listening to the server status immediately, and have no way to
  // unsubscribe, but that's not currently required. We could expose "start" and
  // "stop" actions in the future if needed.
  nodejs.channel.addListener('server:status', (msg: StatusMessage) => {
    store.setState(msg, true);
  });

  // The backend will send a `'server:status'` message when it starts, but if
  // it started before the frontend (e.g. when react native reloads the
  // frontend), we need to tell it to re-send the status.
  nodejs.channel.post('get-server-status');

  return store;
}
