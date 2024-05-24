import * as React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
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
import {AudioRecordingContextProvider} from './AudioRecordingContext.tsx';

type AppProvidersProps = {
  children: React.ReactNode;
  messagePort: MessagePortLike;
  localDiscoveryController: ReturnType<typeof createLocalDiscoveryController>;
  mapeoApi: MapeoClientApi;
};

const queryClient = new QueryClient();

export const AppProviders = ({
  children,
  messagePort,
  localDiscoveryController,
  mapeoApi,
}: AppProvidersProps) => {
  return (
    <IntlProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <TrackTimerContextProvider>
            <GPSModalContextProvider>
              <ServerLoading messagePort={messagePort}>
                <LocalDiscoveryProvider value={localDiscoveryController}>
                  <ApiProvider api={mapeoApi}>
                    <ActiveProjectProvider>
                      <PhotoPromiseProvider>
                        <SecurityProvider>{children}</SecurityProvider>
                      </PhotoPromiseProvider>
                    </ActiveProjectProvider>
                  </ApiProvider>
                </LocalDiscoveryProvider>
              </ServerLoading>
            </GPSModalContextProvider>
          </TrackTimerContextProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </IntlProvider>
  );
};
