import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';

import {FatalError} from './screens/FatalError';
import type {ServerStateStore} from './lib/ServerStateStore.js';

export const ServerLoading = ({
  serverStateStore,
  children,
}: React.PropsWithChildren<{
  serverStateStore: ServerStateStore;
}>) => {
  const serverState = React.useSyncExternalStore(
    serverStateStore.subscribe,
    serverStateStore.getSnapshot,
  );

  // TODO: We could now render the app during the server startup, however
  // leaving as-is for now since this is the current behavior.
  if (serverState.value === 'STARTING') {
    return null;
  }

  if (serverState.value === 'ERROR') {
    SplashScreen.hide();
    return <FatalError />;
  }

  return <>{children}</>;
};
