import React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';
import {MapeoClientApi} from '@comapeo/ipc';
import {MapeoManager} from '@comapeo/core';
import {
  AppUsageStatsPromptProvider,
  createAppUsageStatsPromptStore,
} from '../contexts/AppUsageStatsPromptContext';
import {AppUsagePromptInterstitial} from './AppUsagePromptInterstitial';
import {AppUsageSharingSuccess} from './AppUsageSharingSuccess';
import {RootStack} from '../Navigation/Stack';
import {HomeTabs} from '../Navigation/Tab';

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  init: jest.fn(),
  withScope: jest.fn(),
  addBreadcrumb: jest.fn(),
  configureScope: jest.fn(),
}));

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
    await fastifyController.start();

    const ipcSetup = setUpIPC({manager});
    ({client} = ipcSetup);
    ipcSetup.start();

    const {stop} = ipcSetup;
    onTeardown.push(stop);
    onTeardown.push(() => fastifyController.stop());
    await client.createProject({name: 'test project'});
  });

  afterEach(async () => {
    for (const fn of onTeardown) {
      await fn();
    }
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
          <RootStack.Navigator>
            <RootStack.Screen
              name="AppUsagePromptInterstitial"
              component={AppUsagePromptInterstitial}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="AppUsageSharingSuccess"
              component={AppUsageSharingSuccess}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="Home"
              component={HomeTabs}
              options={{headerShown: false}}
            />
          </RootStack.Navigator>
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

  test('dismisses screen when pressing "No, not now"', async () => {
    const user = userEvent.setup();
    renderScreen({optedIn: null});

    await user.press(await screen.findByText('No, not now'));
    expect(
      screen.queryByText('Help improve your experience.'),
    ).not.toBeVisible();
  });

  test('navigates to App Usage Sharing Success screen correctly after pressing count me in', async () => {
    const user = userEvent.setup();
    renderScreen();

    const yesButton = await screen.findByText('Yes, count me in');
    await user.press(yesButton);

    await expect(screen.findByText('Success!')).resolves.toBeVisible();
  });

  test('skips prompt if not enough time has passed since onboarding', () => {
    renderScreen({
      completedOnboardingAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    });

    expect(
      screen.queryByText('Help improve your experience.'),
    ).not.toBeOnTheScreen();
  });

  test('pressing Done on success screen sets optedIn to true and navigates to home screen', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.press(await screen.findByText('Yes, count me in'));
    await user.press(await screen.findByText('Done'));

    expect(screen.queryByText('Success!')).not.toBeOnTheScreen();
  });

  test('re-prompts user after three months if initially opted out', async () => {
    const threeMonthsAndOneDay = 91 * 24 * 60 * 60 * 1000;

    renderScreen({
      optedIn: false,
      completedOnboardingAt: Date.now() - threeMonthsAndOneDay,
      lastPromptAt: Date.now() - threeMonthsAndOneDay,
      promptCount: 1,
    });

    expect(
      await screen.findByText('Help improve your experience.'),
    ).toBeVisible();
  });
});
