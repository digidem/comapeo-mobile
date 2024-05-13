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
import {AppStackParamsList} from './sharedTypes/navigation';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://e0e02907e05dc72a6da64c3483ed88a6@o4507148235702272.ingest.us.sentry.io/4507170965618688',
  debug:
    process.env.APP_VARIANT === 'development' ||
    process.env.APP_VARIANT === 'test', // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort, {timeout: Infinity});
const localDiscoveryController = createLocalDiscoveryController(mapeoApi);
localDiscoveryController.start();
initializeNodejs();
SplashScreen.preventAutoHideAsync();

const App = () => {
  const navRef = useNavigationContainerRef<AppStackParamsList>();
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

export default Sentry.wrap(App);
