import {
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {type AppStackParamsList} from './sharedTypes/navigation';

import {RootStackNavigator} from './Navigation/Stack';
import type Sentry from '@sentry/react-native';
import {PostHogProvider} from 'posthog-react-native';
import {postHog} from './App';

export const AppNavigator = ({
  permissionAsked,
  navigationIntegration,
}: {
  permissionAsked: boolean;
  navigationIntegration:
    | ReturnType<(typeof Sentry)['reactNavigationIntegration']>
    | undefined;
}) => {
  const containerRef =
    React.useRef<NavigationContainerRef<AppStackParamsList>>(null);

  if (permissionAsked) {
    SplashScreen.hide();
  }

  return (
    <NavigationContainer
      ref={containerRef}
      onReady={() => {
        navigationIntegration?.registerNavigationContainer(containerRef);
      }}
      onStateChange={state => {
        if (postHog.optedOut) return;
        if (!state) return;
        const previousRouteName = state.routes[state.index - 1]?.name;
        const currentRouteName = state.routes[state.index]?.name;
        const params = state.routes[state.index]?.params;
        if (previousRouteName !== currentRouteName && currentRouteName) {
          postHog.screen(currentRouteName, {params: JSON.stringify(params)});
        }
      }}>
      <PostHogProvider
        client={postHog}
        autocapture={{captureScreens: false, captureTouches: true}}>
        <React.Suspense fallback={null}>
          <RootStackNavigator />
        </React.Suspense>
      </PostHogProvider>
    </NavigationContainer>
  );
};
