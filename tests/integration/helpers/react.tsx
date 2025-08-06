import {type MapeoClientApi} from '@comapeo/ipc';
import {getLocales} from 'expo-localization';
import {Component, type ComponentPropsWithoutRef, type ReactNode} from 'react';

import {createActiveProjectIdStore} from '../../../src/frontend/contexts/ActiveProjectIdStoreContext';
import {AppProviders} from '../../../src/frontend/contexts/AppProviders';
import {createCoordinateFormatStore} from '../../../src/frontend/contexts/CoordinateFormatStoreContext';
import type {
  createLocalDiscoveryController,
  LocalDiscoveryState,
} from '../../../src/frontend/contexts/LocalDiscoveryContext';
import {
  createLocaleStore,
  LocaleStore,
  LocaleStoreProvider,
} from '../../../src/frontend/contexts/LocaleStoreContext';
import {createManualEntryCoordinateFormatStore} from '../../../src/frontend/contexts/ManualEntryCoordinateFormatStoreContext';
import {createMetricsDiagnosticsStore} from '../../../src/frontend/contexts/MetricsDiagnosticsStoreContext';
import {createDraftObservationStore} from '../../../src/frontend/contexts/PersistedStores/DraftObservationStore';
import {createSecurityStore} from '../../../src/frontend/contexts/SecurityStoreContext';
import {createTrackStore} from '../../../src/frontend/contexts/TrackStoreContext';
import {getAppLanguageTag} from '../../../src/frontend/lib/intl';
import {AppDiagnosticMetrics} from '../../../src/frontend/metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../../../src/frontend/metrics/DeviceDiagnosticMetrics';
import {IntlProvider} from '../../../src/frontend/contexts/IntlContext';
import {QueryClient} from '@tanstack/react-query';
import {createSavedLocationStore} from '../../../src/frontend/contexts/SavedLocationContext';
import {createAppUsageStatsPromptStore} from '../../../src/frontend/contexts/AppUsageStatsPromptContext';

const DEFAULT_LOCAL_DISCOVERY_STATE: LocalDiscoveryState = {
  status: 'started',
  ssid: 'CoMapeo Test Wi-Fi',
  wifiStatus: 'on',
  wifiConnection: 'connected',
  wifiLinkSpeed: 1234,
};

const DISCONNECTED_LOCAL_DISCOVERY_STATE: LocalDiscoveryState = {
  status: 'started',
  ssid: null,
  wifiStatus: 'off',
  wifiConnection: 'disconnected',
  wifiLinkSpeed: null,
};

export function createMinimalWrapper() {
  const localeStore = createLocaleStore({persist: false});

  return ({children}: {children: ReactNode}) => {
    return (
      <LocaleStoreProvider value={localeStore}>
        <IntlProvider>{children}</IntlProvider>
      </LocaleStoreProvider>
    );
  };
}

export function createAppProvidersWrapper({
  mapeoApi,
  isOnline = true,
}: {
  mapeoApi: MapeoClientApi;
  isOnline?: boolean;
}) {
  const queryClient = new QueryClient({
    // Disable garbage collection, so that no "collect garbage" timers are
    // started, which would otherwise leave an open handle, giving a Jest
    // warning. See [this tip in the Tanstack Query docs][0] and [this cache
    // example scenario][1].
    // [0]: https://tanstack.com/query/latest/docs/framework/react/guides/testing#set-gctime-to-infinity-with-jest
    // [1]: https://tanstack.com/query/latest/docs/framework/react/guides/caching
    defaultOptions: {
      queries: {gcTime: Infinity},
      mutations: {gcTime: Infinity},
    },
  });

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

  const localDiscoveryController: ReturnType<
    typeof createLocalDiscoveryController
  > = {
    subscribe: jest.fn(() => jest.fn()),
    getSnapshot: () => ({
      ...(isOnline
        ? DEFAULT_LOCAL_DISCOVERY_STATE
        : DISCONNECTED_LOCAL_DISCOVERY_STATE),
    }),
    start: jest.fn(),
    stop: jest.fn(),
  };

  const persistedDraftObservationStore = createDraftObservationStore({
    persist: true,
  });

  const persistedTrackStore = createTrackStore({
    persist: true,
  });

  const persistedSecurityStore = createSecurityStore({
    persist: false,
  });

  const persistedCoordinateFormatStore = createCoordinateFormatStore({
    persist: true,
  });

  const persistedManualEntryCoordinateFormatStore =
    createManualEntryCoordinateFormatStore({
      persist: true,
    });

  const persistedActiveProjectIdStore = createActiveProjectIdStore();

  const persistedSavedLocationStore = createSavedLocationStore({
    persist: false,
  });

  const appUsageStatsPromptStore = createAppUsageStatsPromptStore();

  const OuterWrapper = createMinimalWrapper();
  const wrapper = ({children}: {children: ReactNode}) => {
    return (
      <OuterWrapper>
        <AppProviders
          queryClient={queryClient}
          mapeoApi={mapeoApi}
          localDiscoveryController={localDiscoveryController}
          activeProjectIdStore={persistedActiveProjectIdStore}
          persistedDrafObservationStore={persistedDraftObservationStore}
          metricsDiagnosticsStore={persistedMetricsDiagnosticsStore}
          securityStore={persistedSecurityStore}
          manualEntryCoordinateFormatStore={
            persistedManualEntryCoordinateFormatStore
          }
          coordinateFormatStore={persistedCoordinateFormatStore}
          savedLocationStore={persistedSavedLocationStore}
          trackStore={persistedTrackStore}
          appUsageStatsPromptStore={appUsageStatsPromptStore}>
          {children}
        </AppProviders>
      </OuterWrapper>
    );
  };

  const teardown = () => {
    localDiscoveryController.stop();
    appDiagnosticMetrics.setEnabled(false);
    deviceDiagnosticMetrics.setEnabled(false);
  };

  return {wrapper, teardown};
}
