import * as React from 'react';
import {createMapeoClient} from '@mapeo/ipc';
import {AppNavigator} from './AppNavigator';
import {MessagePortLike} from './lib/MessagePortLike';
import {initializeNodejs} from './initializeNodejs';
import {PermissionsAndroid} from 'react-native';
import {AppProviders} from './contexts/AppProviders';
import {createLocalDiscoveryController} from './contexts/LocalDiscoveryContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import * as TaskManager from 'expo-task-manager';
import {LOCATION_TASK_NAME, LocationCallbackInfo} from './sharedTypes/location';
import {storage} from './hooks/persistedState/createPersistedState';
import {tracksStore} from './hooks/persistedState/usePersistedTrack';
import {useOnBackgroundedAndForegrounded} from './hooks/useOnBackgroundedAndForegrounded';
import {getSentryUserId} from './metrics/getSentryUserId';
import {AppDiagnosticMetrics} from './metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from './metrics/DeviceDiagnosticMetrics';

Sentry.init({
  dsn: 'https://e0e02907e05dc72a6da64c3483ed88a6@o4507148235702272.ingest.us.sentry.io/4507170965618688',
  tracesSampleRate: 1.0,
  debug:
    process.env.APP_VARIANT === 'development' ||
    process.env.APP_VARIANT === 'test', // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  initialScope: {
    user: {
      id: getSentryUserId({now: new Date(), storage}),
    },
  },
});

const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort, {timeout: Infinity});
const localDiscoveryController = createLocalDiscoveryController(mapeoApi);
const appDiagnosticMetrics = new AppDiagnosticMetrics();
const deviceDiagnosticMetrics = new DeviceDiagnosticMetrics();
localDiscoveryController.start();
initializeNodejs();
SplashScreen.preventAutoHideAsync();

// Defines task that handles background location updates for tracks feature
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({data, error}: LocationCallbackInfo) => {
    if (error) {
      console.error('Error while processing location update callback', error);
    }

    if (data?.locations) {
      const {addNewLocations} = tracksStore.getState();

      addNewLocations(
        data.locations.map(loc => ({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        })),
      );
    }
  },
);

const App = () => {
  const [permissionsAsked, setPermissionsAsked] = React.useState(false);
  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ]).then(() => setPermissionsAsked(true));
  }, []);

  useOnBackgroundedAndForegrounded(mapeoApi);

  React.useEffect(() => {
    // TODO: Set this conditionally based on consent.
    appDiagnosticMetrics.setEnabled(true);
  }, []);

  React.useEffect(() => {
    // TODO: Set this conditionally based on consent.
    deviceDiagnosticMetrics.setEnabled(true);
  }, []);

  return (
    <AppProviders
      messagePort={messagePort}
      localDiscoveryController={localDiscoveryController}
      mapeoApi={mapeoApi}>
      <AppNavigator permissionAsked={permissionsAsked} />
    </AppProviders>
  );
};

export default Sentry.wrap(App);
