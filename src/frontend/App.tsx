import * as React from 'react';
import {getLocales} from 'expo-localization';
import {createMapeoClient} from '@comapeo/ipc';
import {QueryClient} from '@tanstack/react-query';
import {AppNavigator} from './AppNavigator';
import {MessagePortLike} from './lib/MessagePortLike';
import {initializeNodejs} from './initializeNodejs';
import Mapbox from '@rnmapbox/maps';
import {PermissionsAndroid} from 'react-native';
import {AppProviders} from './contexts/AppProviders';
import {createLocalDiscoveryController} from './contexts/LocalDiscoveryContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import * as TaskManager from 'expo-task-manager';
import nodejs from 'nodejs-mobile-react-native';
import {applicationId} from 'expo-application';
import {LOCATION_TASK_NAME, LocationCallbackInfo} from './sharedTypes/location';
import {storage} from './hooks/persistedState/createPersistedState';
import {useOnBackgroundedAndForegrounded} from './hooks/useOnBackgroundedAndForegrounded';
import {getSentryUserId} from './metrics/getSentryUserId';
import {AppDiagnosticMetrics} from './metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from './metrics/DeviceDiagnosticMetrics';
import {createDraftObservationStore} from './contexts/PersistedStores/DraftObservationStore';
import {createTrackStore} from './contexts/TrackStoreContext';
import {createSecurityStore} from './contexts/SecurityStoreContext';
import {createCoordinateFormatStore} from './contexts/CoordinateFormatStoreContext';
import {createManualEntryCoordinateFormatStore} from './contexts/ManualEntryCoordinateFormatStoreContext';
import {createActiveProjectIdStore} from './contexts/ActiveProjectIdStoreContext';
import {createMetricsDiagnosticsStore} from './contexts/MetricsDiagnosticsStoreContext';
import {
  createLocaleStore,
  LocaleStoreProvider,
} from './contexts/LocaleStoreContext';
import {getAppLanguageTag} from './lib/intl';
import {IntlProvider} from './contexts/IntlContext';
import {ServerLoading} from './ServerLoading';

type SentryEnvironment = 'development' | 'qa' | 'production';

let sentryEnvironment: SentryEnvironment = 'production';
if (applicationId?.endsWith('.dev') || applicationId?.endsWith('.pre')) {
  sentryEnvironment = 'development';
} else if (applicationId?.endsWith('.rc')) {
  sentryEnvironment = 'qa';
}

const sentryDebug = applicationId?.endsWith('.dev');

Sentry.init({
  dsn: 'https://e0e02907e05dc72a6da64c3483ed88a6@o4507148235702272.ingest.us.sentry.io/4507170965618688',
  tracesSampleRate: 1.0,
  environment: sentryEnvironment,
  debug: sentryDebug, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  initialScope: {user: {id: getSentryUserId({now: new Date(), storage})}},
});

Mapbox.setTelemetryEnabled(false);

const persistedLocaleStore = createLocaleStore({
  persist: true,
});

const appDiagnosticMetrics = new AppDiagnosticMetrics({
  getLocaleInfo: () => {
    const systemLocales = getLocales();
    const localeState = persistedLocaleStore.instance.getState();

    const appLanguageTag = getAppLanguageTag({
      localeState,
      systemLanguageTags: systemLocales.map(l => l.languageTag),
    }).value;

    return {
      appLanguageTag,
      deviceLanguageTag: systemLocales[0]!.languageTag,
    };
  },
});

const deviceDiagnosticMetrics = new DeviceDiagnosticMetrics();
const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort, {timeout: Infinity});
const localDiscoveryController = createLocalDiscoveryController(mapeoApi);
localDiscoveryController.start();
initializeNodejs();

SplashScreen.setOptions({fade: true});
SplashScreen.preventAutoHideAsync().catch(err => {
  console.log(err);
});

const persistedDraftObservationStore = createDraftObservationStore({
  persist: true,
});

const persistedTrackStore = createTrackStore({
  persist: true,
});

const persistedSecurityStore = createSecurityStore({
  persist: true,
});

const persistedCoordinateFormatStore = createCoordinateFormatStore({
  persist: true,
});

const persistedManualEntryCoordinateFormatStore =
  createManualEntryCoordinateFormatStore({
    persist: true,
  });

const persistedActiveProjectIdStore = createActiveProjectIdStore({
  persist: true,
});

const persistedMetricsDiagnosticsStore = createMetricsDiagnosticsStore({
  persist: true,
});

// Ensure that these metrics instances are initially in sync with initial state of relevant store
const metricsIsEnabled =
  persistedMetricsDiagnosticsStore.instance.getState().isEnabled;
appDiagnosticMetrics.setEnabled(metricsIsEnabled);
deviceDiagnosticMetrics.setEnabled(metricsIsEnabled);

// Sync metrics instances with subsequent changes in relevant store state
persistedMetricsDiagnosticsStore.instance.subscribe((current, previous) => {
  if (previous.isEnabled !== current.isEnabled) {
    appDiagnosticMetrics.setEnabled(current.isEnabled);
    deviceDiagnosticMetrics.setEnabled(current.isEnabled);
  }
});

// Defines task that handles background location updates for tracks feature
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({data, error}: LocationCallbackInfo) => {
    if (error) {
      console.error('Error while processing location update callback', error);
    }

    if (data?.locations) {
      persistedTrackStore.actions.addNewLocations(
        data.locations.map(loc => ({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        })),
      );
    }
  },
);

const queryClient = new QueryClient();

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

  return (
    <LocaleStoreProvider value={persistedLocaleStore}>
      <IntlProvider>
        {/* ServerLoading requires internationalization to be set up */}
        <ServerLoading
          messagePort={messagePort}
          requestServerStatus={() => nodejs.channel.post('get-server-status')}
          subscribeToServerStatus={listener => {
            nodejs.channel.addListener('server:status', listener);
            return () => {
              nodejs.channel.removeListener('server:status', listener);
            };
          }}>
          <AppProviders
            queryClient={queryClient}
            localDiscoveryController={localDiscoveryController}
            mapeoApi={mapeoApi}
            persistedDrafObservationStore={persistedDraftObservationStore}
            trackStore={persistedTrackStore}
            securityStore={persistedSecurityStore}
            coordinateFormatStore={persistedCoordinateFormatStore}
            manualEntryCoordinateFormatStore={
              persistedManualEntryCoordinateFormatStore
            }
            activeProjectIdStore={persistedActiveProjectIdStore}
            metricsDiagnosticsStore={persistedMetricsDiagnosticsStore}>
            <AppNavigator permissionAsked={permissionsAsked} />
          </AppProviders>
        </ServerLoading>
      </IntlProvider>
    </LocaleStoreProvider>
  );
};

export default Sentry.wrap(App);
