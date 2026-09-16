import {
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import {AppState} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {type AppStackParamsList} from './sharedTypes/navigation';

import {RootStackNavigator} from './Navigation/Stack';
import type Sentry from '@sentry/react-native';
import {PostHogProvider} from 'posthog-react-native';
import {postHog} from './lib/posthog';
import {linking} from './lib/deepLinkConfig';
import {useQADeviceName} from './contexts/QADeviceNameStoreContext';
import {SetQADeviceNameScreen} from './screens/SetQADeviceName';
import {isQABuild} from './lib/appVariant';

export const AppNavigator = ({
  navigationIntegration,
}: {
  navigationIntegration:
    ReturnType<(typeof Sentry)['reactNavigationIntegration']> | undefined;
}) => {
  const containerRef =
    React.useRef<NavigationContainerRef<AppStackParamsList>>(null);
  const qaDeviceName = useQADeviceName();

  // Hiding the splash while a system dialog is presented leaves the app
  // `inactive`, and on iOS the hide silently no-ops in that state. The
  // local-network prompt still fires on a fresh iOS install, so hide once the
  // app is active, retrying when it returns to the foreground.
  React.useEffect(() => {
    const hide = () => {
      SplashScreen.hideAsync().catch(() => {});
    };

    if (AppState.currentState === 'active') {
      hide();
      return;
    }

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        hide();
        sub.remove();
      }
    });
    return () => sub.remove();
  }, []);

  if (isQABuild && !qaDeviceName) {
    return <SetQADeviceNameScreen />;
  }

  return (
    <NavigationContainer
      ref={containerRef}
      linking={{
        ...linking,
        // Always return undefined so React Navigation never auto-navigates
        // from a URL. DeepLinkListener handles all deep link navigation.
        getStateFromPath: () => undefined,
      }}
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
