import {
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import {Suspense, useRef} from 'react';
import {type AppStackParamsList} from './sharedTypes/navigation';

import {RootStackNavigator} from './Navigation/Stack';
import type Sentry from '@sentry/react-native';
import {PostHogProvider} from 'posthog-react-native';
import {postHog} from './lib/posthog';
import {linking} from './lib/deepLinkConfig';
import {useQADeviceName} from './contexts/QADeviceNameStoreContext';
import {SetQADeviceNameScreen} from './screens/SetQADeviceName';
import {isQABuild} from './lib/appVariant';
import {useReshowTrackingNotification} from './hooks/useReshowTrackingNotification';

export const AppNavigator = ({
  navigationIntegration,
}: {
  navigationIntegration:
    ReturnType<(typeof Sentry)['reactNavigationIntegration']> | undefined;
}) => {
  const containerRef = useRef<NavigationContainerRef<AppStackParamsList>>(null);
  const qaDeviceName = useQADeviceName();
  useReshowTrackingNotification();

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
        <Suspense fallback={null}>
          <RootStackNavigator />
        </Suspense>
      </PostHogProvider>
    </NavigationContainer>
  );
};
