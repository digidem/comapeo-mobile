import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';

import type {ServerStateStore} from './lib/ServerStateStore.js';
import {useStore} from 'zustand';

export const ServerLoading = ({
  serverStateStore,
  children,
}: React.PropsWithChildren<{
  serverStateStore: ServerStateStore;
}>) => {
  const serverState = useStore(serverStateStore);

  // TODO: We could now render the app during the server startup, however
  // leaving as-is for now since this is the current behavior.
  if (serverState.value === 'STARTING' || serverState.value === 'CHECKING') {
    return null;
  }

  if (serverState.value === 'MIGRATING') {
    return null;
  }

  if (serverState.value === 'LOW_SPACE') {
    // TODO: You can "skip" migrating when there's low space by calling
    // `initializeNodejs` with `forceSkipMigrate`
    return null;
  }

  if (serverState.value === 'MIGRATION_ERROR') {
    return null;
  }

  if (serverState.value === 'ERROR') {
    SplashScreen.hide();
    throw new Error('Server not loading');
  }

  return <>{children}</>;
};
