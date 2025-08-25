import * as React from 'react';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {render, screen} from '@testing-library/react-native';
import type {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';

import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';

import {HomeHeader} from './HomeHeader';
import {useStorageStatusStore} from '../contexts/StorageStatusStoreContext';

jest.mock('../hooks/useCurrentTime', () => ({
  useCurrentTime: () => new Date(),
}));

const Stack = createNativeStackNavigator<{HomeHeaderRoute: undefined}>();

function HomeHeaderScreen() {
  const baseHeader: Pick<
    BottomTabHeaderProps,
    'navigation' | 'route' | 'options' | 'layout'
  > = {
    navigation: {} as BottomTabHeaderProps['navigation'],
    route: {key: 'home', name: 'HomeHeaderRoute'} as RouteProp<
      ParamListBase,
      string
    >,
    options: {} as BottomTabHeaderProps['options'],
    layout: {width: 320, height: 60},
  };

  return (
    <HomeHeader
      {...baseHeader}
      backgroundColor="#fff"
      showBottomBorder
      navigation={{} as BottomTabHeaderProps['navigation']}
    />
  );
}

describe('HomeHeader low storage badge (navigator + AppProviders)', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];

  beforeEach(async () => {
    onTeardown = [];

    const managerSetup = await createManager({
      name: 'test',
      deviceType: 'mobile',
    });
    manager = managerSetup.manager;

    await managerSetup.fastifyController.start();
    onTeardown.push(() => managerSetup.fastifyController.stop());

    const ipc = setUpIPC({manager});
    client = ipc.client;
    onTeardown.push(ipc.stop);

    const projectId = await client.createProject({name: 'Test Project'});
    await client.getProject(projectId);
  });

  afterEach(async () => {
    useStorageStatusStore.setState({
      freeBytes: null,
      totalBytes: null,
      isLow: false,
      dismissedMapBannerSession: false,
    });

    for (const fn of onTeardown) await fn();
  });

  function renderHeader({isOnline = true}: {isOnline?: boolean} = {}) {
    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      isOnline,
    });
    onTeardown.push(appProviders.teardown);

    const utils = render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="HomeHeaderRoute" component={HomeHeaderScreen} />
        </Stack.Navigator>
      </NavigationContainer>,
      {wrapper: appProviders.wrapper},
    );

    const safeUnmount = async () => {
      utils.unmount();
      await new Promise(res => setTimeout(res, 0));
    };
    onTeardown.unshift(safeUnmount);

    return utils;
  }

  it('shows badge when isLow is true', async () => {
    renderHeader();

    await screen.findByTestId('drawer-icon-home');

    useStorageStatusStore.getState().setPartial({isLow: true});

    expect(await screen.findByTestId('low-storage-badge')).toBeTruthy();
  });

  it('hides badge when isLow is false', async () => {
    renderHeader();

    await screen.findByTestId('drawer-icon-home');

    useStorageStatusStore.getState().setPartial({isLow: false});

    expect(screen.queryByTestId('low-storage-badge')).toBeNull();
  });
});
