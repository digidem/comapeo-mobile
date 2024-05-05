import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createMapeoClient} from '@mapeo/ipc';
import {AppNavigator} from './AppNavigator';
import {AppStackList} from './Navigation/Stack';
import {IntlProvider} from './contexts/IntlContext';
import {MessagePortLike} from './lib/MessagePortLike';
import {initializeNodejs} from './initializeNodejs';
import {PermissionsAndroid} from 'react-native';
import {AppProviders} from './contexts/AppProviders';
import {createLocalDiscoveryController} from './contexts/LocalDiscoveryContext';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import 'react-native-gesture-handler';

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
        <NavigationContainer ref={navRef}>
          <BottomSheetModalProvider>
            <AppNavigator permissionAsked={permissionsAsked} />
          </BottomSheetModalProvider>
        </NavigationContainer>
      </AppProviders>
    </IntlProvider>
  );
};

export default App;
