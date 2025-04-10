import * as SplashScreen from 'expo-splash-screen';
import {type ReactNode} from 'react';

import {useServerState} from './contexts/ServerStateStoreContext';
import {FatalError} from './screens/FatalError';

export const ServerLoading = ({children}: {children: ReactNode}) => {
  const serverStatus = useServerState(state => state.status);

  // Don't render any children while the backend is starting.
  // This avoids timeouts from API methods if server startup takes too long.
  // All api calls should be from children of this component.
  if (serverStatus === 'starting') {
    return null;
  }

  if (serverStatus === 'error') {
    SplashScreen.hide();
    return <FatalError />;
  }

  return <>{children}</>;
};
