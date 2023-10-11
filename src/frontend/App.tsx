import * as React from 'react';
// We need to wrap the app with this provider to fix an issue with the bottom sheet modal backdrop
// not overlaying the navigation header. Without this, the header is accessible even when
// the modal is open, which we don't want (e.g. header back button shouldn't be reachable).
// See https://github.com/gorhom/react-native-bottom-sheet/issues/1157
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {AppNavigator} from './Navigation/AppNavigator';
import {IntlProvider} from './contexts/IntlContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Loading} from './sharedComponents/ApiLoading';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AppProvider} from './contexts/AppProvider';

const queryClient = new QueryClient();

const App = () => {
  return (
    <IntlProvider>
      <Loading>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{flex: 1}}>
            <BottomSheetModalProvider>
              <AppProvider>
                <AppNavigator />
              </AppProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </Loading>
    </IntlProvider>
  );
};

export default App;
