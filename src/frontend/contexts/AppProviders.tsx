import * as React from 'react';
import {ClientApiProvider, MapServerProvider} from '@comapeo/core-react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {fetch} from 'expo/fetch';
import {AuthProvider} from './AuthContext';
import {
  LocalDiscoveryProvider,
  createLocalDiscoveryController,
} from './LocalDiscoveryContext';
import {type MapeoClientApi} from '@comapeo/ipc';
import {DraftObservationProvider} from './DraftObservationContext';
import {DraftObservationStore} from './PersistedStores/DraftObservationStore';
import {type TrackStore, TrackStoreProvider} from './TrackStoreContext';
import {SecurityStore, SecurityStoreProvider} from './SecurityStoreContext';
import {
  type ActiveProjectIdStore,
  ActiveProjectIdStoreProvider,
} from './ActiveProjectIdStoreContext';
import {
  type CoordinateFormatStore,
  CoordinateFormatStoreProvider,
} from './CoordinateFormatStoreContext';
import {
  type ManualEntryCoordinateFormatStore,
  ManualEntryCoordinateFormatStoreProvider,
} from './ManualEntryCoordinateFormatStoreContext';
import {
  type MetricsDiagnosticsStore,
  MetricsDiagnosticsStoreProvider,
} from './MetricsDiagnosticsStoreContext';
import {LocationProvider} from './LocationContext';
import {
  SavedLocationStoreProvider,
  SavedLocationStore,
} from './SavedLocationContext';
import {
  LowStorageBannerStoreProvider,
  type LowStorageBannerStore,
} from './LowStorageBannerContext';
import {
  AppUsageStatsProvider,
  type AppUsageStatsStore,
} from './AppUsageStatsContext';
import {
  EarlyAccessStoreProvider,
  type EarlyAccessStore,
} from './EarlyAccessContext';

type AppProvidersProps = {
  children: React.ReactNode;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: MapeoClientApi;
  mapServerApi: {getBaseUrl: () => Promise<URL>};
  persistedDrafObservationStore: DraftObservationStore;
  trackStore: TrackStore;
  securityStore: SecurityStore;
  coordinateFormatStore: CoordinateFormatStore;
  manualEntryCoordinateFormatStore: ManualEntryCoordinateFormatStore;
  activeProjectIdStore: ActiveProjectIdStore;
  metricsDiagnosticsStore: MetricsDiagnosticsStore;
  savedLocationStore: SavedLocationStore;
  queryClient: QueryClient;
  lowStorageBannerStore: LowStorageBannerStore;
  appUsageStatsStore: AppUsageStatsStore;
  earlyAccessStore: EarlyAccessStore;
};

export const AppProviders = ({
  children,
  localDiscoveryController,
  mapeoApi,
  mapServerApi,
  persistedDrafObservationStore,
  trackStore,
  securityStore,
  coordinateFormatStore,
  manualEntryCoordinateFormatStore,
  activeProjectIdStore,
  metricsDiagnosticsStore,
  savedLocationStore,
  queryClient,
  lowStorageBannerStore,
  earlyAccessStore,
  appUsageStatsStore,
}: AppProvidersProps) => {
  return (
    <MetricsDiagnosticsStoreProvider value={metricsDiagnosticsStore}>
      <AppUsageStatsProvider value={appUsageStatsStore}>
        <SecurityStoreProvider value={securityStore}>
          <CoordinateFormatStoreProvider value={coordinateFormatStore}>
            <ManualEntryCoordinateFormatStoreProvider
              value={manualEntryCoordinateFormatStore}>
              <TrackStoreProvider value={trackStore}>
                <QueryClientProvider client={queryClient}>
                  <LowStorageBannerStoreProvider value={lowStorageBannerStore}>
                    <SafeAreaProvider>
                      <GestureHandlerRootView style={styles.flex}>
                        <SavedLocationStoreProvider value={savedLocationStore}>
                          <LocationProvider>
                            <LocalDiscoveryProvider
                              value={localDiscoveryController}>
                              <ClientApiProvider clientApi={mapeoApi}>
                                <MapServerProvider
                                  getBaseUrl={mapServerApi.getBaseUrl}
                                  fetch={fetch}
                                  queryClient={queryClient}>
                                  <ActiveProjectIdStoreProvider
                                    store={activeProjectIdStore}>
                                    <DraftObservationProvider
                                      draftObservationStore={
                                        persistedDrafObservationStore
                                      }>
                                      <EarlyAccessStoreProvider
                                        value={earlyAccessStore}>
                                        <AuthProvider>{children}</AuthProvider>
                                      </EarlyAccessStoreProvider>
                                    </DraftObservationProvider>
                                  </ActiveProjectIdStoreProvider>
                                </MapServerProvider>
                              </ClientApiProvider>
                            </LocalDiscoveryProvider>
                          </LocationProvider>
                        </SavedLocationStoreProvider>
                      </GestureHandlerRootView>
                    </SafeAreaProvider>
                  </LowStorageBannerStoreProvider>
                </QueryClientProvider>
              </TrackStoreProvider>
            </ManualEntryCoordinateFormatStoreProvider>
          </CoordinateFormatStoreProvider>
        </SecurityStoreProvider>
      </AppUsageStatsProvider>
    </MetricsDiagnosticsStoreProvider>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});
