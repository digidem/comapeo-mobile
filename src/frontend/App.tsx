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
import {applicationId} from 'expo-application';
import {LOCATION_TASK_NAME, LocationCallbackInfo} from './sharedTypes/location';
import {storage} from './hooks/persistedState/createPersistedState';
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
import {createSavedLocationStore} from './contexts/SavedLocationContext';
import {createServerStateStore} from './lib/ServerStateStore.ts';

type SentryEnvironment = 'development' | 'qa' | 'production';

let sentryEnvironment: SentryEnvironment = 'production';
if (applicationId?.endsWith('.dev') || applicationId?.endsWith('.pre')) {
  sentryEnvironment = 'development';
} else if (applicationId?.endsWith('.rc')) {
  sentryEnvironment = 'qa';
}

const sentryDebug = applicationId?.endsWith('.dev');
const appMetricsOptIn = sentryEnvironment !== 'production';
let navigationIntegration:
  | ReturnType<(typeof Sentry)['reactNavigationIntegration']>
  | undefined = undefined;
const sentryUserId = getSentryUserId({now: new Date(), storage});

Sentry.init({
  dsn: 'https://e0e02907e05dc72a6da64c3483ed88a6@o4507148235702272.ingest.us.sentry.io/4507170965618688',
  tracesSampleRate: appMetricsOptIn ? 1.0 : 0, // Only enable tracing once we have user consent
  enableUserInteractionTracing: appMetricsOptIn, // Only enable user interaction tracing once we have user consent
  environment: sentryEnvironment,
  debug: sentryDebug, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  initialScope: {user: {id: sentryUserId}},
});

if (appMetricsOptIn) {
  Sentry.setTag('appMetricsOptIn', 'true');
  navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
    ignoreEmptyBackNavigationTransactions: false,
  });
  Sentry.getClient()?.addIntegration(navigationIntegration);
}

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
const serverStateStore = createServerStateStore();
const messagePort = new MessagePortLike({serverStateStore});
const mapeoApi = createMapeoClient(messagePort, {timeout: Infinity});
messagePort.start();
const localDiscoveryController = createLocalDiscoveryController(mapeoApi);
localDiscoveryController.start();

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

const savedLocationStore = createSavedLocationStore({persist: true});

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

// Need to know if metrics are enabled before starting node
initializeNodejs({metricsIsEnabled, sentryEnvironment, sentryUserId});

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

  return (
    <LocaleStoreProvider value={persistedLocaleStore}>
      <IntlProvider>
        {/* ServerLoading requires internationalization to be set up */}
        <ServerLoading serverStateStore={serverStateStore}>
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
            savedLocationStore={savedLocationStore}
            activeProjectIdStore={persistedActiveProjectIdStore}
            metricsDiagnosticsStore={persistedMetricsDiagnosticsStore}>
            <AppNavigator
              permissionAsked={permissionsAsked}
              navigationIntegration={navigationIntegration}
            />
          </AppProviders>
        </ServerLoading>
      </IntlProvider>
    </LocaleStoreProvider>
  );
};

export default Sentry.wrap(App, {
  touchEventBoundaryProps: {
    labelName: 'accessibilityLabel',
  },
});
