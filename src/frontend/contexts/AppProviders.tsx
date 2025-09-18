import * as React from 'react';
import {ClientApiProvider} from '@comapeo/core-react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PhotoPromiseProvider} from './PhotoPromiseContext';
import {ActiveProjectProvider} from './ActiveProjectContext';
import {AuthProvider} from './AuthContext';
import {
  LocalDiscoveryProvider,
  createLocalDiscoveryController,
} from './LocalDiscoveryContext';
import {type MapeoClientApi} from '@comapeo/ipc';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
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
import PostHog, {PostHogProvider} from 'posthog-react-native';

type AppProvidersProps = {
  children: React.ReactNode;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: MapeoClientApi;
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
  postHogInstance?: PostHog;
};

export const AppProviders = ({
  children,
  localDiscoveryController,
  mapeoApi,
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
  appUsageStatsStore,
  postHogInstance,
}: AppProvidersProps) => {
  return (
    <MetricsDiagnosticsStoreProvider value={metricsDiagnosticsStore}>
      <AppUsageStatsProvider value={appUsageStatsStore}>
        <ActiveProjectIdStoreProvider value={activeProjectIdStore}>
          <SecurityStoreProvider value={securityStore}>
            <CoordinateFormatStoreProvider value={coordinateFormatStore}>
              <ManualEntryCoordinateFormatStoreProvider
                value={manualEntryCoordinateFormatStore}>
                <TrackStoreProvider value={trackStore}>
                  <QueryClientProvider client={queryClient}>
                    <LowStorageBannerStoreProvider
                      value={lowStorageBannerStore}>
                      <SafeAreaProvider>
                        <GestureHandlerRootView style={styles.flex}>
                          <SavedLocationStoreProvider
                            value={savedLocationStore}>
                            <LocationProvider>
                              <LocalDiscoveryProvider
                                value={localDiscoveryController}>
                                <ClientApiProvider clientApi={mapeoApi}>
                                  <ActiveProjectProvider>
                                    <BottomSheetModalProvider>
                                      <PhotoPromiseProvider>
                                        <DraftObservationProvider
                                          draftObservationStore={
                                            persistedDrafObservationStore
                                          }>
                                          <AuthProvider>
                                            {/* Post Hog not initialized in integration tests */}
                                            {postHogInstance ? (
                                              <PostHogProvider
                                                client={postHogInstance}>
                                                {children}
                                              </PostHogProvider>
                                            ) : (
                                              children
                                            )}
                                          </AuthProvider>
                                        </DraftObservationProvider>
                                      </PhotoPromiseProvider>
                                    </BottomSheetModalProvider>
                                  </ActiveProjectProvider>
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
        </ActiveProjectIdStoreProvider>
      </AppUsageStatsProvider>
    </MetricsDiagnosticsStoreProvider>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});
