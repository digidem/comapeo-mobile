import * as React from 'react';
import {useNavigationContainerRef} from '@react-navigation/native';
import {createMapeoClient} from '@mapeo/ipc';

import {AppNavigator} from './Navigation/AppNavigator';
import {AppStackList} from './Navigation/AppStack';
import {IntlProvider} from './contexts/IntlContext';
import {ApiProvider} from './contexts/ApiContext';
import {PhotoPromiseProvider} from './contexts/PhotoPromiseContext';
import {SecurityProvider} from './contexts/SecurityContext';
import {QueryClient} from '@tanstack/react-query';
import {MessagePortLike} from './lib/MessagePortLike';
import {ServerLoading} from './ServerLoading';
import {ActiveProjectProvider} from './contexts/ProjectContext';
import {initializeNodejs} from './initializeNodejs';
import {PermissionsAndroid} from 'react-native';
import {ExternalProviders} from './contexts/ExternalProviders';
import {
  LocalDiscoveryProvider,
  createLocalDiscoveryController,
} from './contexts/LocalDiscoveryContext';
import {Loading} from './sharedComponents/Loading';
import * as SplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient();
const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort, {timeout: Infinity});
const localDiscoveryController = createLocalDiscoveryController(mapeoApi);
localDiscoveryController.start();
initializeNodejs();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const navRef = useNavigationContainerRef<AppStackList>();
  const [permissionsAsked, setPermissionsAsked] = React.useState(false);

  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ]).then(() => setPermissionsAsked(true));
  }, []);

  return (
    <IntlProvider>
      <ExternalProviders queryClient={queryClient} navRef={navRef}>
        <ServerLoading messagePort={messagePort}>
          <LocalDiscoveryProvider value={localDiscoveryController}>
            <ApiProvider api={mapeoApi}>
              <ActiveProjectProvider>
                <PhotoPromiseProvider>
                  <SecurityProvider>
                    <React.Suspense fallback={<Loading />}>
                      <AppNavigator permissionAsked={permissionsAsked} />
                    </React.Suspense>
                  </SecurityProvider>
                </PhotoPromiseProvider>
              </ActiveProjectProvider>
            </ApiProvider>
          </LocalDiscoveryProvider>
        </ServerLoading>
      </ExternalProviders>
    </IntlProvider>
  );
}
