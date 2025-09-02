import {
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {type AppStackParamsList} from './sharedTypes/navigation';

import {useSetUpInvitesListeners} from '@comapeo/core-react';
import {RootStackNavigator} from './Navigation/Stack';
import type Sentry from '@sentry/react-native';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {AppUsageStatsProvider} from './contexts/AppUsageStatsProvider';

const posthog = new PostHog('', {defaultOptIn: false});

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
  useSetUpInvitesListeners();

  if (permissionAsked) {
    SplashScreen.hide();
  }

  return (
    <NavigationContainer
      ref={containerRef}
      onStateChange={state => {
        if (posthog.optedOut) return;
        if (!state) return;
        const previousRouteName = state.routes[state.index - 1]?.name;
        const currentRouteName = state.routes[state.index]?.name;
        const params = state.routes[state.index]?.params;
        if (previousRouteName !== currentRouteName && currentRouteName) {
          posthog.screen(currentRouteName, {params: JSON.stringify(params)});
        }
      }}
      onReady={() => {
        navigationIntegration?.registerNavigationContainer(containerRef);
      }}>
      <PostHogProvider
        client={posthog}
        options={{defaultOptIn: false}}
        autocapture={{
          captureScreens: false, // this does not work on react-nav v7 and must be done in `onStateChange` - see above
          captureTouches: true,
        }}>
        <AppUsageStatsProvider>
          <React.Suspense fallback={null}>
            <RootStackNavigator />
          </React.Suspense>
        </AppUsageStatsProvider>
      </PostHogProvider>
    </NavigationContainer>
  );
};
