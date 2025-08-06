import React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';
import type {AppStackParamsList} from '../sharedTypes/navigation';
import {MapeoClientApi} from '@comapeo/ipc';
import {MapeoManager} from '@comapeo/core';
import {
  AppUsageStatsPromptProvider,
  createAppUsageStatsPromptStore,
} from '../contexts/AppUsageStatsPromptContext';
import {AppUsagePromptInterstitial} from './AppUsagePromptInterstitial';
import {AppUsageSharingSuccess} from './AppUsageSharingSuccess';

const Stack = createNativeStackNavigator<AppStackParamsList>();

describe('IntroToCoMapeo integration', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];

  beforeEach(async () => {
    onTeardown = [];
    const managerSetup = await createManager({
      name: 'test-device',
      deviceType: 'mobile',
    });
    ({manager} = managerSetup);
    const {fastifyController} = managerSetup;

    const ipcSetup = setUpIPC({manager});
    ({client} = ipcSetup);
    ipcSetup.start();

    const {stop} = ipcSetup;
    onTeardown.push(stop);
    await fastifyController.start();
    onTeardown.push(() => fastifyController.stop());
  });

  afterEach(async () => {
    for (const fn of onTeardown) {
      await fn();
    }
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  interface RenderScreenOptions {
    optedIn?: boolean | null;
    completedOnboardingAt?: number;
    lastPromptAt?: number | null;
    promptCount?: number;
  }

  function renderScreen({
    optedIn = null,
    completedOnboardingAt = Date.now() - 8 * 24 * 60 * 60 * 1000,
    lastPromptAt = null,
    promptCount = 0,
  }: RenderScreenOptions = {}) {
    const appProviders = createAppProvidersWrapper({mapeoApi: client});

    const appUsageStore = createAppUsageStatsPromptStore();
    appUsageStore.instance.setState({
      optedIn,
      completedOnboardingAt,
      lastPromptAt,
      promptCount,
    });

    render(
      <NavigationContainer>
        <AppUsageStatsPromptProvider value={appUsageStore}>
          <Stack.Navigator initialRouteName="AppUsagePromptInterstitial">
            <Stack.Screen
              name="AppUsagePromptInterstitial"
              component={AppUsagePromptInterstitial}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AppUsageSharingSuccess"
              component={AppUsageSharingSuccess}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </AppUsageStatsPromptProvider>
      </NavigationContainer>,
      {wrapper: appProviders.wrapper},
    );
    onTeardown.push(appProviders.teardown);
  }

  test('renders AppUsagePrompt screen when conditions are met', async () => {
    renderScreen();

    expect(
      await screen.findByText('Help improve your experience.'),
    ).toBeVisible();
    expect(screen.getByText('No, not now')).toBeVisible();
  });

  test('does not show screen if optedIn already true', async () => {
    renderScreen({optedIn: true});

    expect(
      screen.queryByText('Help improve your experience.'),
    ).not.toBeOnTheScreen();
  });

  test('navigates to App Usage Sharing Success screen correctly after opting in', async () => {
    const user = userEvent.setup();
    renderScreen();

    const yesButton = await screen.findByText('Yes, count me in');
    await user.press(yesButton);

    await expect(screen.findByText('Success!')).resolves.toBeVisible();

    expect(screen.getByText('test-device')).toBeVisible();
  });
});
