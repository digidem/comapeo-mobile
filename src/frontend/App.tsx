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
import {Loading} from './sharedComponents/ApiLoading';
import {PermissionsProvider} from './contexts/PermissionsContext';
import {PhotoPromiseProvider} from './contexts/PhotoPromiseContext';
import {SecurityProvider} from './contexts/SecurityContext';
import {LocationProvider} from './contexts/LocationContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  const navRef = useNavigationContainerRef<AppStackList>();

  return (
    <IntlProvider>
      <QueryClientProvider client={queryClient}>
        <PermissionsProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <BottomSheetModalProvider>
              <NavigationContainer ref={navRef}>
                <LocationProvider>
                  <SecurityProvider>
                    <PhotoPromiseProvider>
                      <Loading>
                        <AppNavigator />
                      </Loading>
                    </PhotoPromiseProvider>
                  </SecurityProvider>
                </LocationProvider>
              </NavigationContainer>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </PermissionsProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
};

export default App;
