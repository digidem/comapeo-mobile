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
// `setConnected` is backed by the Android-only MLRNModule.setConnected; it's
// undefined on iOS (no equivalent connectivity manager), so guard the call.
setConnected?.(true);

import {QueryClient} from '@tanstack/react-query';
import {AppNavigator} from './AppNavigator';
import {
  comapeo as mapeoApi,
  comapeoServicesClient,
} from '@comapeo/core-react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {requestForegroundPermissionsAsync} from 'expo-location';
import {AppProviders} from './contexts/AppProviders';
import {createLocalDiscoveryController} from './contexts/LocalDiscoveryContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import * as TaskManager from 'expo-task-manager';
import {LOCATION_TASK_NAME, LocationCallbackInfo} from './sharedTypes/location';
import {initSentry} from '@comapeo/core-react-native/sentry';
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
import {createLowStorageBannerStore} from './contexts/LowStorageBannerContext.tsx';
import {createAppUsageStatsStore} from './contexts/AppUsageStatsContext.tsx';
import {Suspense} from 'react';
import {Loading} from './sharedComponents/Loading.tsx';
import {createEarlyAccessStore} from './contexts/EarlyAccessContext.tsx';
import {FatalError} from './screens/FatalError.tsx';
import {FatalErrorUntranslated} from './screens/FatalErrorUntranslated.tsx';
import {postHog} from './lib/posthog.ts';
import {APP_VARIANT} from './lib/appVariant.ts';

// DSN / environment / tracesSampleRate are baked into the native config by the
// @comapeo/core-react-native plugin (app.config.js) and locked by initSentry,
// which owns the Sentry.init call across the RN, Node, and Android-FGS hubs —
// we pass only the allowlisted extensions. Tracing stays env-gated via the
// plugin's tracesSampleRate; the full runtime consent model (and a stable user
// id) migrates later with an updated core-react-native.
const appMetricsOptIn = APP_VARIANT !== 'production';
let navigationIntegration:
  | ReturnType<(typeof Sentry)['reactNavigationIntegration']>
  | undefined = undefined;

initSentry({
  integrations: defaults => {
    if (!appMetricsOptIn) return defaults;
    navigationIntegration = Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: true,
      ignoreEmptyBackNavigationTransactions: false,
    });
    return [...defaults, navigationIntegration];
  },
  tags: appMetricsOptIn ? {appMetricsOptIn: 'true'} : undefined,
});

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
const mapServerApi = {
  async getBaseUrl() {
    return new URL(await comapeoServicesClient.mapServer.getBaseUrl());
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

const App = () => {
  const [permissionsAsked, setPermissionsAsked] = React.useState(false);
  React.useEffect(() => {
    // PermissionsAndroid is Android-only (no-op on iOS), so iOS needs its own
    // path or location is never requested. Camera on iOS is requested on
    // demand by the camera screen, so the eager ask is location-only there.
    const askStartupPermissions =
      Platform.OS === 'android'
        ? PermissionsAndroid.requestMultiple([
            'android.permission.CAMERA',
            'android.permission.ACCESS_FINE_LOCATION',
            'android.permission.ACCESS_COARSE_LOCATION',
          ])
        : requestForegroundPermissionsAsync();

    Promise.resolve(askStartupPermissions)
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
      <LocaleContext value={persistedLocaleStore}>
        <IntlProvider>
          {/* This fatal error requires internationalization to be set up */}
          <Sentry.ErrorBoundary fallback={<FatalError />}>
            <ServerLoading>
              <Suspense fallback={<Loading />}>
                <AppProviders
                  queryClient={queryClient}
                  localDiscoveryController={localDiscoveryController}
                  mapeoApi={mapeoApi}
                  mapServerApi={mapServerApi}
                  persistedDrafObservationStore={persistedDraftObservationStore}
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
                  unitSystemStore={persistedUnitSystemStore}>
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
    </Sentry.ErrorBoundary>
  );
};

export default Sentry.wrap(App, {
  touchEventBoundaryProps: {
    labelName: 'accessibilityLabel',
  },
});
