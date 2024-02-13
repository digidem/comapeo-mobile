import * as React from 'react';
import {createMapeoClient} from '@mapeo/ipc';

import {AppNavigator} from './Navigation/AppNavigator';
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

const queryClient = new QueryClient();
const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort, {timeout: Infinity});
const localDiscoveryController = createLocalDiscoveryController({
  startLocalPeerDiscovery() {
    return mapeoApi.startLocalPeerDiscovery();
  },
  stopLocalPeerDiscovery() {
    // TODO: Wait for sync to finish. Currently will disconnect all peers
    // immediately, even if they are currently syncing
    return mapeoApi.stopLocalPeerDiscovery({force: true});
  },
});
localDiscoveryController.start();
initializeNodejs();

const App = () => {
  const [permissionsAsked, setPermissionsAsked] = React.useState(false);
  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ]).then(val => setPermissionsAsked(true));
  }, []);

  return (
    <IntlProvider>
      <ExternalProviders queryClient={queryClient}>
        <ServerLoading messagePort={messagePort}>
          <LocalDiscoveryProvider value={localDiscoveryController}>
            <ApiProvider api={mapeoApi}>
              <ActiveProjectProvider>
                <PhotoPromiseProvider>
                  <SecurityProvider>
                    <AppNavigator permissionAsked={permissionsAsked} />
                  </SecurityProvider>
                </PhotoPromiseProvider>
              </ActiveProjectProvider>
            </ApiProvider>
          </LocalDiscoveryProvider>
        </ServerLoading>
      </ExternalProviders>
    </IntlProvider>
  );
};

export default App;
