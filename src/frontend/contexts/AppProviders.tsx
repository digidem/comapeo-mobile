import * as React from 'react';
import {ClientApiProvider} from '@comapeo/core-react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TrackTimerContextProvider} from './TrackTimerContext';
import {PhotoPromiseProvider} from './PhotoPromiseContext';
import {ActiveProjectProvider} from './ActiveProjectContext';
import {SecurityProvider} from './SecurityContext';
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

type AppProvidersProps = {
  children: React.ReactNode;
  messagePort: MessagePortLike;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: MapeoClientApi;
  appMetrics: AppDiagnosticMetrics;
  deviceMetrics: DeviceDiagnosticMetrics;
  persistedDrafObservationStore: DraftObservationStore;
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
}: AppProvidersProps) => {
  return (
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
                      <ActiveProjectProvider>
                        <BottomSheetModalProvider>
                          <PhotoPromiseProvider>
                            <DraftObservationProvider
                              draftObservationStore={
                                persistedDrafObservationStore
                              }>
                              <SecurityProvider>{children}</SecurityProvider>
                            </DraftObservationProvider>
                          </PhotoPromiseProvider>
                        </BottomSheetModalProvider>
                      </ActiveProjectProvider>
                    </MetricsProvider>
                  </ClientApiProvider>
                </LocalDiscoveryProvider>
              </ServerLoading>
            </TrackTimerContextProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});
