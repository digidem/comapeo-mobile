import * as React from 'react';
import {ClientApiProvider} from '@comapeo/core-react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TrackTimerContextProvider} from './TrackTimerContext';
import {PhotoPromiseProvider} from './PhotoPromiseContext';
import {ActiveProjectProvider} from './ActiveProjectContext';
import {AuthProvider} from './AuthContext';
import {
  LocalDiscoveryProvider,
  createLocalDiscoveryController,
} from './LocalDiscoveryContext';
import {type MapeoClientApi} from '@comapeo/ipc';
import {ServerLoading} from '../ServerLoading';
import {MessagePortLike} from '../lib/MessagePortLike';
import {IntlProvider} from './IntlContext';
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
import {LocaleStore, LocaleStoreProvider} from './LocaleStoreContext';
import {LocationProvider} from './LocationContext';

type AppProvidersProps = {
  children: React.ReactNode;
  messagePort: MessagePortLike;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: MapeoClientApi;
  persistedDrafObservationStore: DraftObservationStore;
  trackStore: TrackStore;
  securityStore: SecurityStore;
  coordinateFormatStore: CoordinateFormatStore;
  manualEntryCoordinateFormatStore: ManualEntryCoordinateFormatStore;
  activeProjectIdStore: ActiveProjectIdStore;
  metricsDiagnosticsStore: MetricsDiagnosticsStore;
  localeStore: LocaleStore;
};

const queryClient = new QueryClient();

export const AppProviders = ({
  children,
  messagePort,
  localDiscoveryController,
  mapeoApi,
  persistedDrafObservationStore,
  trackStore,
  securityStore,
  coordinateFormatStore,
  manualEntryCoordinateFormatStore,
  activeProjectIdStore,
  metricsDiagnosticsStore,
  localeStore,
}: AppProvidersProps) => {
  return (
    <LocaleStoreProvider value={localeStore}>
      <MetricsDiagnosticsStoreProvider value={metricsDiagnosticsStore}>
        <ActiveProjectIdStoreProvider value={activeProjectIdStore}>
          <SecurityStoreProvider value={securityStore}>
            <CoordinateFormatStoreProvider value={coordinateFormatStore}>
              <ManualEntryCoordinateFormatStoreProvider
                value={manualEntryCoordinateFormatStore}>
                <TrackStoreProvider value={trackStore}>
                  <IntlProvider>
                    <QueryClientProvider client={queryClient}>
                      <SafeAreaProvider>
                        <GestureHandlerRootView style={styles.flex}>
                          <LocationProvider>
                            <TrackTimerContextProvider>
                              <ServerLoading messagePort={messagePort}>
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
                                              {children}
                                            </AuthProvider>
                                          </DraftObservationProvider>
                                        </PhotoPromiseProvider>
                                      </BottomSheetModalProvider>
                                    </ActiveProjectProvider>
                                  </ClientApiProvider>
                                </LocalDiscoveryProvider>
                              </ServerLoading>
                            </TrackTimerContextProvider>
                          </LocationProvider>
                        </GestureHandlerRootView>
                      </SafeAreaProvider>
                    </QueryClientProvider>
                  </IntlProvider>
                </TrackStoreProvider>
              </ManualEntryCoordinateFormatStoreProvider>
            </CoordinateFormatStoreProvider>
          </SecurityStoreProvider>
        </ActiveProjectIdStoreProvider>
      </MetricsDiagnosticsStoreProvider>
    </LocaleStoreProvider>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});
