import * as React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';
// We need to wrap the app with this provider to fix an issue with the bottom sheet modal backdrop
// not overlaying the navigation header. Without this, the header is accessible even when
// the modal is open, which we don't want (e.g. header back button shouldn't be reachable).
// See https://github.com/gorhom/react-native-bottom-sheet/issues/1157
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {AppStackList} from '../Navigation/AppStack';
import {GPSModalContextProvider} from './GPSModalContext';
import {TrackTimerContextProvider} from './TrackTimerContext';

type ExternalProvidersProp = {
  children: React.ReactNode;
  queryClient: QueryClient;
  navRef: NavigationContainerRefWithCurrent<AppStackList>;
};

export const ExternalProviders = ({
  children,
  queryClient,
  navRef,
}: ExternalProvidersProp) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <GPSModalContextProvider>
          <TrackTimerContextProvider>
            <BottomSheetModalProvider>
              <NavigationContainer ref={navRef}>{children}</NavigationContainer>
            </BottomSheetModalProvider>
          </TrackTimerContextProvider>
        </GPSModalContextProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};
