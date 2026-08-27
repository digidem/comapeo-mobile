import * as React from 'react';
import {Logger, setConnected} from '@maplibre/maplibre-react-native';

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

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import {AppNavigator} from './AppNavigator';
import {
  comapeo as mapeoApi,
  comapeoServicesClient,
} from '@comapeo/core-react-native';
import {PermissionsAndroid, Platform, AppState} from 'react-native';
import {requestForegroundPermissionsAsync} from 'expo-location';
import {AppProviders} from './contexts/AppProviders';
import {createLocalDiscoveryController} from './contexts/LocalDiscoveryContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import * as TaskManager from 'expo-task-manager';
import {LOCATION_TASK_NAME, LocationCallbackInfo} from './sharedTypes/location';
import {
  initSentry,
  setApplicationUsageData,
  getDiagnosticsEnabled,
  getApplicationUsageData,
} from '@comapeo/core-react-native/sentry';
import {createDraftObservationStore} from './contexts/PersistedStores/DraftObservationStore';
import {createTrackStore} from './contexts/TrackStoreContext';
import {createSecurityStore} from './contexts/SecurityStoreContext';
import {createCoordinateFormatStore} from './contexts/CoordinateFormatStoreContext';
import {createUnitSystemStore} from './contexts/UnitSystemStoreContext';
import {createManualEntryCoordinateFormatStore} from './contexts/ManualEntryCoordinateFormatStoreContext';
import {createActiveProjectIdStore} from './contexts/ActiveProjectIdStoreContext';
import {createLocaleStore, LocaleContext} from './contexts/LocaleStoreContext';
import {IntlProvider} from './contexts/IntlContext';
import {ServerLoading} from './ServerLoading';
import {createSavedLocationStore} from './contexts/SavedLocationContext';
import {createLowStorageBannerStore} from './contexts/LowStorageBannerContext.tsx';
import {createAppUsageStatsStore} from './contexts/AppUsageStatsContext.tsx';
import {Suspense} from 'react';
import {FullScreenCenteredLoader} from './sharedComponents/FullScreenCenteredLoader.tsx';
import {createEarlyAccessStore} from './contexts/EarlyAccessContext.tsx';
import {createQADeviceNameStore} from './contexts/QADeviceNameStoreContext.tsx';
import {FatalError} from './screens/FatalError.tsx';
import {FatalErrorUntranslated} from './screens/FatalErrorUntranslated.tsx';
import {postHog} from './lib/posthog.ts';
import {getLocales} from 'expo-localization';
import {AppDiagnosticMetrics} from './metrics/AppDiagnosticMetrics.ts';
import {DeviceDiagnosticMetrics} from './metrics/DeviceDiagnosticMetrics.ts';

let navigationIntegration:
  ReturnType<(typeof Sentry)['reactNavigationIntegration']> | undefined =
  undefined;

const backendAppUsageDataEnabled = getApplicationUsageData();

initSentry({
  integrations: defaults => {
    if (!backendAppUsageDataEnabled) return defaults;
    navigationIntegration = Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: true,
      ignoreEmptyBackNavigationTransactions: false,
    });
    return [...defaults, navigationIntegration];
  },
  tags: backendAppUsageDataEnabled ? {appMetricsOptIn: 'true'} : undefined,
});

const persistedLocaleStore = createLocaleStore({
  persist: true,
});

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

const qaDeviceNameStore = createQADeviceNameStore({persist: true});

const savedLocationStore = createSavedLocationStore({persist: true});
const lowStorageBannerStore = createLowStorageBannerStore();
const earlyAccessStore = createEarlyAccessStore({persist: true});
const persistedUnitSystemStore = createUnitSystemStore({persist: true});

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

// App must be restart for the diagnostics to be turned on/off in the backend so this keeps it in sync
appDiagnosticMetrics.setEnabled(backendAppUsageDataEnabled);

const appUsagePromptStore = createAppUsageStatsStore({
  persist: true,
  appUsageMetricsOptIn: () => {
    postHog.optIn();
    appDiagnosticMetrics.setEnabled(true);
    // Restart-to-activate: takes effect next launch, not this session.
    setApplicationUsageData(true).catch(err => {
      Sentry.captureException(err);
    });
  },
  appUsageMetricsOptOut: () => {
    postHog.optOut();
    appDiagnosticMetrics.setEnabled(false);
    setApplicationUsageData(false).catch(err => {
      Sentry.captureException(err);
    });
  },
});

const deviceDiagnosticMetrics = new DeviceDiagnosticMetrics();
const backendDeviceDiagnosticsEnabled = getDiagnosticsEnabled();
// App must be restart for the diagnostics to be turned on/off in the backend so this keeps it in sync
deviceDiagnosticMetrics.setEnabled(backendDeviceDiagnosticsEnabled);

const queryClient = new QueryClient();

AppState.addEventListener('change', status => {
  focusManager.setFocused(status === 'active');
});

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
      <QueryClientProvider client={queryClient}>
        <LocaleContext value={persistedLocaleStore}>
          <IntlProvider>
            {/* This fatal error requires internationalization to be set up */}
            <Sentry.ErrorBoundary fallback={<FatalError />}>
              <ServerLoading>
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
