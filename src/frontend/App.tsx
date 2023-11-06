import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
// We need to wrap the app with this provider to fix an issue with the bottom sheet modal backdrop
// not overlaying the navigation header. Without this, the header is accessible even when
// the modal is open, which we don't want (e.g. header back button shouldn't be reachable).
// See https://github.com/gorhom/react-native-bottom-sheet/issues/1157
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {AppNavigator} from './Navigation/AppNavigator';
import {AppStackList} from './Navigation/AppStack';
import {IntlProvider} from './contexts/IntlContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ApiProvider} from './contexts/ApiContext';
import {PermissionsProvider} from './contexts/PermissionsContext';
import {PhotoPromiseProvider} from './contexts/PhotoPromiseContext';
import {SecurityProvider} from './contexts/SecurityContext';
import {LocationProvider} from './contexts/LocationContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ObservationProvider} from './contexts/ObservationsContext';
import {MessagePortLike} from './lib/MessagePortLike';
import {createMapeoClient} from '@mapeo/ipc';
import {ApiLoading} from './sharedComponents/ApiLoading';
import {ActiveProjectProvider} from './contexts/ProjectContext';

const queryClient = new QueryClient();
const messagePort = new MessagePortLike();
const mapeoApi = createMapeoClient(messagePort);

const App = () => {
  const navRef = useNavigationContainerRef<AppStackList>();

  return (
    <IntlProvider>
      <PermissionsProvider>
        <QueryClientProvider client={queryClient}>
          <ApiLoading messagePort={messagePort}>
            <ApiProvider api={mapeoApi}>
              <ActiveProjectProvider>
                <GestureHandlerRootView style={{flex: 1}}>
                  <BottomSheetModalProvider>
                    <ObservationProvider>
                      <NavigationContainer ref={navRef}>
                        <PhotoPromiseProvider>
                          <LocationProvider>
                            <SecurityProvider>
                              <AppNavigator />
                            </SecurityProvider>
                          </LocationProvider>
                        </PhotoPromiseProvider>
                      </NavigationContainer>
                    </ObservationProvider>
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </ActiveProjectProvider>
            </ApiProvider>
          </ApiLoading>
        </QueryClientProvider>
      </PermissionsProvider>
    </IntlProvider>
  );
};

export default App;
