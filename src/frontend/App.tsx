import * as React from 'react';
import {Logger, setConnected} from '@maplibre/maplibre-react-native';
import {getLocales} from 'expo-localization';

// Maplibre logs when tile requests are cancelled, which is often.
// this turns off the unneccessary noise in the console logs
Logger.setLogCallback(log => {
  if (
    log.tag === 'Mbgl-HttpRequest' &&
    log.message.startsWith('Request failed due to a permanent error: Canceled')
  ) {
    return true;
  }
  return false;
});

// All styles are served via localhost and we need to bypass the internal connectivity manager in MapLibre React Native
// in order for things to work while the app is offline.
// https://github.com/maplibre/maplibre-react-native/blob/6f99de530eec2e06de485ef86f4be61f941e0e09/docs/content/modules/mlrn-module.md#setconnectedconnected
setConnected(true);

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import {AppNavigator} from './AppNavigator';
import {initializeNodejs} from './initializeNodejs';
import {AppState, PermissionsAndroid} from 'react-native';
import {AppProviders} from './contexts/AppProviders';
import {createLocalDiscoveryController} from './contexts/LocalDiscoveryContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import * as TaskManager from 'expo-task-manager';
import {LOCATION_TASK_NAME, LocationCallbackInfo} from './sharedTypes/location';
import {storage} from './hooks/persistedState/createPersistedState';
import {getSentryUserId} from './metrics/getSentryUserId';
import {AppDiagnosticMetrics} from './metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from './metrics/DeviceDiagnosticMetrics';
import {createDraftObservationStore} from './contexts/PersistedStores/DraftObservationStore';
import {createTrackStore} from './contexts/TrackStoreContext';
import {createSecurityStore} from './contexts/SecurityStoreContext';
import {createCoordinateFormatStore} from './contexts/CoordinateFormatStoreContext';
import {createUnitSystemStore} from './contexts/UnitSystemStoreContext';
import {createManualEntryCoordinateFormatStore} from './contexts/ManualEntryCoordinateFormatStoreContext';
import {createActiveProjectIdStore} from './contexts/ActiveProjectIdStoreContext';
import {createMetricsDiagnosticsStore} from './contexts/MetricsDiagnosticsStoreContext';
import {createLocaleStore, LocaleContext} from './contexts/LocaleStoreContext';
import {IntlProvider} from './contexts/IntlContext';
import {ServerLoading} from './ServerLoading';
import {createSavedLocationStore} from './contexts/SavedLocationContext';
import {createServerStateStore} from './lib/ServerStateStore.ts';
import {createMapeoApi} from './lib/createMapeoApi.ts';
import {createLowStorageBannerStore} from './contexts/LowStorageBannerContext.tsx';
import {createAppUsageStatsStore} from './contexts/AppUsageStatsContext.tsx';
import {Suspense} from 'react';
import {FullScreenCenteredLoader} from './sharedComponents/FullScreenCenteredLoader.tsx';
import {createEarlyAccessStore} from './contexts/EarlyAccessContext.tsx';
import {createQADeviceNameStore} from './contexts/QADeviceNameStoreContext.tsx';
import {FatalError} from './screens/FatalError.tsx';
import {FatalErrorUntranslated} from './screens/FatalErrorUntranslated.tsx';
import {createAppRpc} from './lib/createAppRpc.ts';
import {postHog} from './lib/posthog.ts';
import {APP_VARIANT} from './lib/appVariant.ts';

type SentryEnvironment = 'development' | 'qa' | 'production';

const sentryEnvironment: SentryEnvironment =
  APP_VARIANT === 'releaseCandidate'
    ? 'qa'
    : APP_VARIANT === 'production'
      ? 'production'
      : 'development';

const appMetricsOptIn = sentryEnvironment !== 'production';
let navigationIntegration:
  ReturnType<(typeof Sentry)['reactNavigationIntegration']> | undefined =
  undefined;
const sentryUserId = getSentryUserId({now: new Date(), storage});

Sentry.init({
  dsn: 'https://e0e02907e05dc72a6da64c3483ed88a6@o4507148235702272.ingest.us.sentry.io/4507170965618688',
  tracesSampleRate: appMetricsOptIn ? 1.0 : 0, // Only enable tracing once we have user consent
  enableUserInteractionTracing: appMetricsOptIn, // Only enable user interaction tracing once we have user consent
  environment: sentryEnvironment,
  debug: false, // this added alot of unneccesary noise to the console.
  initialScope: {user: {id: sentryUserId}},
  enableMetrics: false,
  replaysSessionSampleRate: sentryEnvironment === 'qa' ? 1.0 : 0,
  replaysOnErrorSampleRate: sentryEnvironment === 'qa' ? 1.0 : 0,
  integrations:
    sentryEnvironment === 'qa'
      ? [
          Sentry.mobileReplayIntegration({
            maskAllText: false,
            maskAllImages: false,
            maskAllVectors: false,
          }),
        ]
      : [],
});

if (appMetricsOptIn) {
  Sentry.setTag('appMetricsOptIn', 'true');
  navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
    ignoreEmptyBackNavigationTransactions: false,
  });
  Sentry.getClient()?.addIntegration(navigationIntegration);
}

const qaDeviceNameStore = createQADeviceNameStore({persist: true});

const initialQADeviceName = qaDeviceNameStore.instance.getState().qaDeviceName;
if (initialQADeviceName) {
  Sentry.setTag('QA_Device_Name', initialQADeviceName);
}

const persistedLocaleStore = createLocaleStore({
  persist: true,
});

const appDiagnosticMetrics = new AppDiagnosticMetrics({
  getLocaleInfo: () => {
    const systemLocales = getLocales();
    const {languageTag} = persistedLocaleStore.instance.getState();

    return {
      appLanguageTag: languageTag,
      deviceLanguageTag: systemLocales[0]!.languageTag,
    };
  },
});
const deviceDiagnosticMetrics = new DeviceDiagnosticMetrics();
const serverStateStore = createServerStateStore();
const mapeoApi = createMapeoApi({serverStateStore});
const appRpc = createAppRpc({serverStateStore});
const mapServerListenPromise = appRpc.mapServer.listen();
const mapServerApi = {
  async getBaseUrl() {
    const {localPort} = await mapServerListenPromise;
    return new URL(`http://127.0.0.1:${localPort}`);
  },
};
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
const lowStorageBannerStore = createLowStorageBannerStore();
const earlyAccessStore = createEarlyAccessStore({persist: true});
const persistedUnitSystemStore = createUnitSystemStore({persist: true});

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

const appUsagePromptStore = createAppUsageStatsStore({
  persist: true,
  appUsageMetricsOptIn: () => {
    postHog.optIn();
  },
  appUsageMetricsOptOut: () => {
    postHog.optOut();
  },
});

const queryClient = new QueryClient();

AppState.addEventListener('change', status => {
  focusManager.setFocused(status === 'active');
});

const App = () => {
  const [permissionsAsked, setPermissionsAsked] = React.useState(false);
  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ])
      .catch(err => {
        // Rejects when no Activity is attached (e.g. launched in the
        // background)
        Sentry.captureException(err);
      })
      // Always dismiss the splash, regardless of outcome — this startup ask
      // is only an eager prompt; each feature re-requests its own permission
      // on demand. Never gate splash dismissal on the request succeeding.
      .finally(() => setPermissionsAsked(true));
  }, []);

  return (
    <Sentry.ErrorBoundary fallback={<FatalErrorUntranslated />}>
      <QueryClientProvider client={queryClient}>
        <LocaleContext value={persistedLocaleStore}>
          <IntlProvider>
            {/* This fatal error requires internationalization to be set up */}
            <Sentry.ErrorBoundary fallback={<FatalError />}>
              <ServerLoading serverStateStore={serverStateStore}>
                <Suspense fallback={<FullScreenCenteredLoader />}>
                  <AppProviders
                    queryClient={queryClient}
                    localDiscoveryController={localDiscoveryController}
                    mapeoApi={mapeoApi}
                    mapServerApi={mapServerApi}
                    persistedDrafObservationStore={
                      persistedDraftObservationStore
                    }
                    trackStore={persistedTrackStore}
                    securityStore={persistedSecurityStore}
                    coordinateFormatStore={persistedCoordinateFormatStore}
                    manualEntryCoordinateFormatStore={
                      persistedManualEntryCoordinateFormatStore
                    }
                    savedLocationStore={savedLocationStore}
                    activeProjectIdStore={persistedActiveProjectIdStore}
                    metricsDiagnosticsStore={persistedMetricsDiagnosticsStore}
                    appUsageStatsStore={appUsagePromptStore}
                    lowStorageBannerStore={lowStorageBannerStore}
                    earlyAccessStore={earlyAccessStore}
                    unitSystemStore={persistedUnitSystemStore}
                    qaDeviceNameStore={qaDeviceNameStore}>
                    <AppNavigator
                      permissionAsked={permissionsAsked}
                      navigationIntegration={navigationIntegration}
                    />
                  </AppProviders>
                </Suspense>
              </ServerLoading>
            </Sentry.ErrorBoundary>
          </IntlProvider>
        </LocaleContext>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
};

export default Sentry.wrap(App, {
  touchEventBoundaryProps: {
    labelName: 'accessibilityLabel',
  },
});
