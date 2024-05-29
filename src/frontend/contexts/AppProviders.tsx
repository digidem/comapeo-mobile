import * as React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// We need to wrap the app with this provider to fix an issue with the bottom sheet modal backdrop
// not overlaying the navigation header. Without this, the header is accessible even when
// the modal is open, which we don't want (e.g. header back button shouldn't be reachable).
// See https://github.com/gorhom/react-native-bottom-sheet/issues/1157
import {GPSModalContextProvider} from './GPSModalContext';
import {TrackTimerContextProvider} from './TrackTimerContext';
import {PhotoPromiseProvider} from './PhotoPromiseContext';
import {ActiveProjectProvider} from './ActiveProjectContext';
import {SecurityProvider} from './SecurityContext';
import {
  LocalDiscoveryProvider,
  createLocalDiscoveryController,
} from './LocalDiscoveryContext';
import {type MapeoClientApi} from '@mapeo/ipc';
import {ServerLoading} from '../ServerLoading';
import {ApiProvider} from './ApiContext';
import {MessagePortLike} from '../lib/MessagePortLike';
import {IntlProvider} from './IntlContext';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {MetricsProvider} from './MetricsContext';
import {AppDiagnosticMetrics} from '../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../metrics/DeviceDiagnosticMetrics';
import {SessionInvitesProvider} from './SessionInvitesContext';

type AppProvidersProps = {
  children: React.ReactNode;
  messagePort: MessagePortLike;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: MapeoClientApi;
  appMetrics: AppDiagnosticMetrics;
  deviceMetrics: DeviceDiagnosticMetrics;
};

const queryClient = new QueryClient();

export const AppProviders = ({
  children,
  messagePort,
  localDiscoveryController,
  mapeoApi,
  appMetrics,
  deviceMetrics,
}: AppProvidersProps) => {
  return (
    <IntlProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.flex}>
            <TrackTimerContextProvider>
              <GPSModalContextProvider>
                <ServerLoading messagePort={messagePort}>
                  <LocalDiscoveryProvider value={localDiscoveryController}>
                    <ApiProvider api={mapeoApi}>
                      <MetricsProvider
                        appMetrics={appMetrics}
                        deviceMetrics={deviceMetrics}>
                        <ActiveProjectProvider>
                          <SessionInvitesProvider>
                            <BottomSheetModalProvider>
                              <PhotoPromiseProvider>
                                <SecurityProvider>{children}</SecurityProvider>
                              </PhotoPromiseProvider>
                            </BottomSheetModalProvider>
                          </SessionInvitesProvider>
                        </ActiveProjectProvider>
                      </MetricsProvider>
                    </ApiProvider>
                  </LocalDiscoveryProvider>
                </ServerLoading>
              </GPSModalContextProvider>
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
