import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';

import type {ServerStateStore} from './lib/ServerStateStore.js';
import {useStore} from 'zustand';
import {Migrating} from './screens/StorageMigration/Migrating';
import {NotEnoughSpace} from './screens/StorageMigration/NotEnoughSpace';
import {parseMigrationProgress} from './lib/parseMigrationProgress';

export const ServerLoading = ({
  serverStateStore,
  onSkipMigration,
  children,
}: React.PropsWithChildren<{
  serverStateStore: ServerStateStore;
  onSkipMigration: () => void;
}>) => {
  const serverState = useStore(serverStateStore);

  // TODO: We could now render the app during the server startup, however
  // leaving as-is for now since this is the current behavior.
  if (serverState.value === 'STARTING' || serverState.value === 'CHECKING') {
    return null;
  }

  if (serverState.value === 'MIGRATING') {
    SplashScreen.hide();
    return <Migrating progress={parseMigrationProgress(serverState.context)} />;
  }

  if (serverState.value === 'LOW_SPACE') {
    SplashScreen.hide();
    return <NotEnoughSpace onSkip={onSkipMigration} />;
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
