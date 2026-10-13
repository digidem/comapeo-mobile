import * as React from 'react';
import {ComapeoCoreProvider} from '@comapeo/core-react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {fetch} from 'expo/fetch';
import {AuthProvider} from './AuthContext';
import {
  LocalDiscoveryProvider,
  createLocalDiscoveryController,
} from './LocalDiscoveryContext';
import {type ComapeoCoreClientApi} from '@comapeo/ipc';
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
  type UnitSystemStore,
  UnitSystemStoreContext,
} from './UnitSystemStoreContext';
import {
  type ManualEntryCoordinateFormatStore,
  ManualEntryCoordinateFormatStoreProvider,
} from './ManualEntryCoordinateFormatStoreContext';
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
import {
  QADeviceNameStoreContext,
  type QADeviceNameStore,
} from './QADeviceNameStoreContext';

type AppProvidersProps = {
  children: React.ReactNode;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: ComapeoCoreClientApi;
  mapServerApi: {getBaseUrl: () => Promise<URL>};
  persistedDrafObservationStore: DraftObservationStore;
  trackStore: TrackStore;
  securityStore: SecurityStore;
  coordinateFormatStore: CoordinateFormatStore;
  manualEntryCoordinateFormatStore: ManualEntryCoordinateFormatStore;
  activeProjectIdStore: ActiveProjectIdStore;
  savedLocationStore: SavedLocationStore;
  queryClient: QueryClient;
  lowStorageBannerStore: LowStorageBannerStore;
  appUsageStatsStore: AppUsageStatsStore;
  earlyAccessStore: EarlyAccessStore;
  unitSystemStore: UnitSystemStore;
  qaDeviceNameStore: QADeviceNameStore;
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
  savedLocationStore,
  queryClient,
  lowStorageBannerStore,
  earlyAccessStore,
  appUsageStatsStore,
  unitSystemStore,
  qaDeviceNameStore,
}: AppProvidersProps) => {
  return (
    <UnitSystemStoreContext value={unitSystemStore}>
      <AppUsageStatsProvider value={appUsageStatsStore}>
        <SecurityStoreProvider value={securityStore}>
          <CoordinateFormatStoreProvider value={coordinateFormatStore}>
            <ManualEntryCoordinateFormatStoreProvider
              value={manualEntryCoordinateFormatStore}>
              <TrackStoreProvider value={trackStore}>
                <LowStorageBannerStoreProvider value={lowStorageBannerStore}>
                  <SafeAreaProvider>
                    <GestureHandlerRootView style={styles.flex}>
                      <SavedLocationStoreProvider value={savedLocationStore}>
                        <LocationProvider>
                          <LocalDiscoveryProvider
                            value={localDiscoveryController}>
                            <ComapeoCoreProvider
                              clientApi={mapeoApi}
                              getMapServerBaseUrl={mapServerApi.getBaseUrl}
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
                                    <QADeviceNameStoreContext
                                      value={qaDeviceNameStore}>
                                      <AuthProvider>{children}</AuthProvider>
                                    </QADeviceNameStoreContext>
                                  </EarlyAccessStoreProvider>
                                </DraftObservationProvider>
                              </ActiveProjectIdStoreProvider>
                            </ComapeoCoreProvider>
                          </LocalDiscoveryProvider>
                        </LocationProvider>
                      </SavedLocationStoreProvider>
                    </GestureHandlerRootView>
                  </SafeAreaProvider>
                </LowStorageBannerStoreProvider>
              </TrackStoreProvider>
            </ManualEntryCoordinateFormatStoreProvider>
          </CoordinateFormatStoreProvider>
        </SecurityStoreProvider>
      </AppUsageStatsProvider>
    </UnitSystemStoreContext>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});
