import {type ComapeoCoreClientApi} from '@comapeo/ipc';
import {getLocales} from 'expo-localization';
import {Component, type ComponentPropsWithoutRef, type ReactNode} from 'react';

import {createActiveProjectIdStore} from '../../../src/contexts/ActiveProjectIdStoreContext';
import {AppProviders} from '../../../src/contexts/AppProviders';
import {createCoordinateFormatStore} from '../../../src/contexts/CoordinateFormatStoreContext';
import type {
  createLocalDiscoveryController,
  LocalDiscoveryState,
} from '../../../src/contexts/LocalDiscoveryContext';
import {
  createLocaleStore,
  LocaleContext,
  LocaleStore,
} from '../../../src/contexts/LocaleStoreContext';
import {createManualEntryCoordinateFormatStore} from '../../../src/contexts/ManualEntryCoordinateFormatStoreContext';
import {createDraftObservationStore} from '../../../src/contexts/PersistedStores/DraftObservationStore';
import {createSecurityStore} from '../../../src/contexts/SecurityStoreContext';
import {createTrackStore} from '../../../src/contexts/TrackStoreContext';
import {AppUsageData} from '../../../src/metrics/AppUsageData';
import {DeviceDiagnostics} from '../../../src/metrics/DeviceDiagnosticMetrics';
import {IntlProvider} from '../../../src/contexts/IntlContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createSavedLocationStore} from '../../../src/contexts/SavedLocationContext';
import {createLowStorageBannerStore} from '../../../src/contexts/LowStorageBannerContext';
import {createEarlyAccessStore} from '../../../src/contexts/EarlyAccessContext';
import {createAppUsageStatsStore} from '../../../src/contexts/AppUsageStatsContext';
import {createUnitSystemStore} from '../../../src/contexts/UnitSystemStoreContext';
import {createQADeviceNameStore} from '../../../src/contexts/QADeviceNameStoreContext';

const DEFAULT_LOCAL_DISCOVERY_STATE: LocalDiscoveryState = {
  status: 'started',
  ssid: 'CoMapeo Test Wi-Fi',
  wifiStatus: 'on',
  wifiLinkSpeed: 1234,
};

const DISCONNECTED_LOCAL_DISCOVERY_STATE: LocalDiscoveryState = {
  status: 'started',
  ssid: null,
  wifiStatus: 'off',
  wifiLinkSpeed: null,
};

jest.mock('expo/fetch', () => ({
  fetch: globalThis.fetch,
}));

export function createMinimalWrapper() {
  const localeStore = createLocaleStore({persist: false});
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {gcTime: Infinity},
      mutations: {gcTime: Infinity},
    },
  });

  return ({children}: {children: ReactNode}) => {
    return (
      <QueryClientProvider client={queryClient}>
        <LocaleContext value={localeStore}>
          <IntlProvider>{children}</IntlProvider>
        </LocaleContext>
      </QueryClientProvider>
    );
  };
}

export function createAppProvidersWrapper({
  mapeoApi,
  isOnline = true,
  activeProjectId,
  qaDeviceName,
}: {
  mapeoApi: ComapeoCoreClientApi;
  isOnline?: boolean;
  activeProjectId?: string;
  qaDeviceName?: string;
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

  const appDiagnosticMetrics = new AppUsageData({
    getLocaleInfo: () => {
      const systemLocales = getLocales();
      const {languageTag} = persistedLocaleStore.instance.getState();

      return {
        appLanguageTag: languageTag,
        deviceLanguageTag: systemLocales[0]!.languageTag,
      };
    },
  });

  const deviceDiagnosticMetrics = new DeviceDiagnostics();

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

  const persistedEarlyAccessStore = createEarlyAccessStore({persist: false});

  const unitSystemStore = createUnitSystemStore({persist: false});

  const qaDeviceNameStore = createQADeviceNameStore({persist: false});
  if (qaDeviceName) {
    qaDeviceNameStore.actions.setQADeviceName(qaDeviceName);
  }

  const lowStorageBannerStore = createLowStorageBannerStore();

  const appUsagePromptStore = createAppUsageStatsStore({
    persist: false,
    appUsageMetricsOptIn: () => {},
    appUsageMetricsOptOut: () => {},
  });

  const mockMapServerApi = {
    getBaseUrl: jest.fn(() =>
      Promise.resolve(new URL('http://127.0.0.1:9999')),
    ),
  };

  if (activeProjectId) {
    persistedActiveProjectIdStore.instance.setState({
      projectId: activeProjectId,
    });
  }

  const OuterWrapper = createMinimalWrapper();
  const wrapper = ({children}: {children: ReactNode}) => {
    return (
      <OuterWrapper>
        <AppProviders
          queryClient={queryClient}
          mapeoApi={mapeoApi}
          mapServerApi={mockMapServerApi}
          localDiscoveryController={localDiscoveryController}
          activeProjectIdStore={persistedActiveProjectIdStore}
          persistedDrafObservationStore={persistedDraftObservationStore}
          securityStore={persistedSecurityStore}
          manualEntryCoordinateFormatStore={
            persistedManualEntryCoordinateFormatStore
          }
          coordinateFormatStore={persistedCoordinateFormatStore}
          savedLocationStore={persistedSavedLocationStore}
          trackStore={persistedTrackStore}
          lowStorageBannerStore={lowStorageBannerStore}
          appUsageStatsStore={appUsagePromptStore}
          earlyAccessStore={persistedEarlyAccessStore}
          unitSystemStore={unitSystemStore}
          qaDeviceNameStore={qaDeviceNameStore}>
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
