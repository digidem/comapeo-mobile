import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';

import type {ServerStateStore} from './lib/ServerStateStore.js';
import {useStore} from 'zustand';
import {Migrating} from './screens/StorageMigration/Migrating';
import {MigrationError} from './screens/StorageMigration/MigrationError';
import {NotEnoughSpace} from './screens/StorageMigration/NotEnoughSpace';
import {UpdateComplete} from './screens/StorageMigration/UpdateComplete';
import {parseMigrationProgress} from './lib/parseMigrationProgress';
import {ExhaustivenessError} from './lib/ExhaustivenessError';

export const ServerLoading = ({
  serverStateStore,
  children,
}: React.PropsWithChildren<{
  serverStateStore: ServerStateStore;
}>) => {
  const serverState = useStore(serverStateStore);

  // If a migration happened this session so we can show the
  // Update Complete screen once, until the user acknowledges it.
  const [wasMigrating, setWasMigrating] = React.useState(false);
  const [completeAcknowledged, setCompleteAcknowledged] = React.useState(false);
  if (serverState.value === 'MIGRATING' && !wasMigrating) {
    // Guarded state adjustment during render, per
    // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    setWasMigrating(true);
  }

  switch (serverState.value) {
    // TODO: We could now render the app during the server startup, however
    // leaving as-is for now since this is the current behavior.
    case 'STARTING':
    case 'CHECKING':
      return null;
    case 'MIGRATING':
      SplashScreen.hide();
      return (
        <Migrating progress={parseMigrationProgress(serverState.context)} />
      );
    case 'LOW_SPACE':
      SplashScreen.hide();
      return <NotEnoughSpace />;
    case 'MIGRATION_ERROR':
      SplashScreen.hide();
      return <MigrationError errorMessage={serverState.error} />;
    case 'ERROR':
      SplashScreen.hide();
      throw new Error('Server not loading');
    case 'STARTED':
      if (wasMigrating && !completeAcknowledged) {
        return (
          <UpdateComplete onContinue={() => setCompleteAcknowledged(true)} />
        );
      }
      return <>{children}</>;
    default:
      throw new ExhaustivenessError(serverState.value);
  }
};
