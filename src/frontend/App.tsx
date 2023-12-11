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

const queryClient = new QueryClient();
const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort);
initializeNodejs();

const App = () => {
  const navRef = useNavigationContainerRef<AppStackList>();
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
      <ExternalProviders queryClient={queryClient} navRef={navRef}>
        <ServerLoading messagePort={messagePort}>
          <ApiProvider api={mapeoApi}>
            <ActiveProjectProvider>
              <PhotoPromiseProvider>
                <SecurityProvider>
                  <AppNavigator permissionAsked={permissionsAsked} />
                </SecurityProvider>
              </PhotoPromiseProvider>
            </ActiveProjectProvider>
          </ApiProvider>
        </ServerLoading>
      </ExternalProviders>
    </IntlProvider>
  );
};

export default App;
