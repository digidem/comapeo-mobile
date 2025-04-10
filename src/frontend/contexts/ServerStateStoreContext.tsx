import {createStore, useStore} from 'zustand';
import {createContext, useContext} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import * as v from 'valibot';
import * as Sentry from '@sentry/react-native';

/**
 * Based on `StatusMessage` type in [backend](../../backend/src/status.js)
 */
const ServerStatusMessageSchema = v.variant('status', [
  v.object({
    status: v.literal('starting'),
  }),
  v.object({
    status: v.literal('ready'),
  }),
  v.object({
    status: v.literal('error'),
    error: v.string(),
    context: v.optional(v.string()),
  }),
]);

type ServerState = v.InferOutput<typeof ServerStatusMessageSchema>;

function initialState(): ServerState {
  return {
    status: 'starting' as const,
  };
}

export function createServerStateStore() {
  const store = createStore(initialState);

  nodejs.channel.addListener('server:status', message => {
    if (!v.is(ServerStatusMessageSchema, message)) {
      Sentry.captureException(
        new Error(`Received unexpected server status message: ${message}`),
      );

      return;
    }

    store.setState(message, true);
  });

  // In case the server starts before the initial listener is added (i.e. initial `server:status` event already sent),
  // prompt the server to resend.
  nodejs.channel.post('get-server-status');

  return store;
}

export type ServerStateStore = ReturnType<typeof createServerStateStore>;

const ServerStateStoreContext = createContext<ServerStateStore | null>(null);

export const ServerStateStoreProvider = ServerStateStoreContext.Provider;

function useServerStateStoreContext() {
  const value = useContext(ServerStateStoreContext);

  if (!value) {
    throw new Error('Must set up ServerStateStoreProvider first');
  }

  return value;
}

export function useServerState(): ServerState;
export function useServerState<T>(selector: (state: ServerState) => T): T;
export function useServerState<T>(selector?: (state: ServerState) => T) {
  const store = useServerStateStoreContext();
  return useStore(store, selector!);
}
