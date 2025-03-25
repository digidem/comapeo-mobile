import * as React from 'react';
import {ClientApiProvider} from '@comapeo/core-react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TrackTimerContextProvider} from './TrackTimerContext';
import {PhotoPromiseProvider} from './PhotoPromiseContext';
import {ActiveProjectIdProvider} from './ActiveProjectContext';
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
import {MetricsProvider} from './MetricsContext';
import {AppDiagnosticMetrics} from '../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../metrics/DeviceDiagnosticMetrics';
import {DraftObservationProvider} from './DraftObservationContext';
import {DraftObservationStore} from './PersistedStores/DraftObservationStore';
import {type TrackStore, TrackStoreProvider} from './TrackStoreContext';
import {SecurityStore, SecurityStoreProvider} from './SecurityStoreContext';

type AppProvidersProps = {
  children: React.ReactNode;
  messagePort: MessagePortLike;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: MapeoClientApi;
  appMetrics: AppDiagnosticMetrics;
  deviceMetrics: DeviceDiagnosticMetrics;
  persistedDrafObservationStore: DraftObservationStore;
  trackStore: TrackStore;
  securityStore: SecurityStore;
};

const queryClient = new QueryClient();

export const AppProviders = ({
  children,
  messagePort,
  localDiscoveryController,
  mapeoApi,
  appMetrics,
  deviceMetrics,
  persistedDrafObservationStore,
  trackStore,
  securityStore,
}: AppProvidersProps) => {
  return (
    <SecurityStoreProvider value={securityStore}>
      <TrackStoreProvider value={trackStore}>
        <IntlProvider>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.flex}>
                <TrackTimerContextProvider>
                  <ServerLoading messagePort={messagePort}>
                    <LocalDiscoveryProvider value={localDiscoveryController}>
                      <ClientApiProvider clientApi={mapeoApi}>
                        <MetricsProvider
                          appMetrics={appMetrics}
                          deviceMetrics={deviceMetrics}>
                          <ActiveProjectIdProvider>
                            <BottomSheetModalProvider>
                              <PhotoPromiseProvider>
                                <DraftObservationProvider
                                  draftObservationStore={
                                    persistedDrafObservationStore
                                  }>
                                  <AuthProvider>{children}</AuthProvider>
                                </DraftObservationProvider>
                              </PhotoPromiseProvider>
                            </BottomSheetModalProvider>
                          </ActiveProjectIdProvider>
                        </MetricsProvider>
                      </ClientApiProvider>
                    </LocalDiscoveryProvider>
                  </ServerLoading>
                </TrackTimerContextProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </QueryClientProvider>
        </IntlProvider>
      </TrackStoreProvider>
    </SecurityStoreProvider>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});
