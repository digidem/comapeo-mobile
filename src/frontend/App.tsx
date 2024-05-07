import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createMapeoClient} from '@mapeo/ipc';
import {AppNavigator} from './AppNavigator';
import {IntlProvider} from './contexts/IntlContext';
import {MessagePortLike} from './lib/MessagePortLike';
import {initializeNodejs} from './initializeNodejs';
import {PermissionsAndroid} from 'react-native';
import {AppProviders} from './contexts/AppProviders';
import {createLocalDiscoveryController} from './contexts/LocalDiscoveryContext';
import {Loading} from './sharedComponents/Loading';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {AppStackList} from './sharedTypes/navigation';

const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort, {timeout: Infinity});
const localDiscoveryController = createLocalDiscoveryController(mapeoApi);
localDiscoveryController.start();
initializeNodejs();

const App = () => {
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
      <AppProviders
        messagePort={messagePort}
        localDiscoveryController={localDiscoveryController}
        mapeoApi={mapeoApi}>
        <React.Suspense fallback={<Loading />}>
          <NavigationContainer ref={navRef}>
            <BottomSheetModalProvider>
              <AppNavigator permissionAsked={permissionsAsked} />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </React.Suspense>
      </AppProviders>
    </IntlProvider>
  );
};

export default App;
