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
import type {ComapeoCoreClientApi} from '@comapeo/ipc';

import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';
import {ActiveProjectProvider} from '../contexts/ActiveProjectContext';

import {HomeHeader} from './HomeHeader';

jest.mock('../hooks/useCurrentTime', () => ({
  useCurrentTime: () => new Date(),
}));

let mockFreeBytes: number | null = null;
let mockTotalBytes: number | null = 64 * 1024 * 1024 * 1024;
jest.mock('../hooks/useStorageReadingQuery', () => {
  return {
    __esModule: true,
    useStorageReadingQuery: () => ({
      data:
        mockFreeBytes == null || mockTotalBytes == null
          ? null
          : {freeBytes: mockFreeBytes, totalBytes: mockTotalBytes},
    }),
  };
});

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
      onPress={() => {}}
      navigation={{} as BottomTabHeaderProps['navigation']}
    />
  );
}

describe('HomeHeader low storage badge (navigator + AppProviders)', () => {
  let manager: MapeoManager;
  let client: ComapeoCoreClientApi;
  let onTeardown: Array<() => unknown> = [];
  let projectId: string;

  beforeEach(async () => {
    onTeardown = [];

    const setup = await createManager({name: 'test', deviceType: 'mobile'});
    manager = setup.manager;
    await setup.fastifyController.start();
    onTeardown.push(() => setup.fastifyController.stop());

    const ipc = setUpIPC({manager});
    client = ipc.client;
    onTeardown.push(ipc.stop);

    mockTotalBytes = 64 * 1024 * 1024 * 1024;
    mockFreeBytes = null;
    projectId = await client.createProject({name: undefined});
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  const renderHeader = async ({
    isOnline = true,
    activeProjectId = projectId,
  }: Readonly<{isOnline?: boolean; activeProjectId?: string}> = {}) => {
    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      isOnline,
      activeProjectId,
    });
    onTeardown.push(appProviders.teardown);

    const utils = await render(
      <React.Suspense fallback={null}>
        <ActiveProjectProvider activeProjectId={activeProjectId}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen
                name="HomeHeaderRoute"
                component={HomeHeaderScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ActiveProjectProvider>
      </React.Suspense>,
      {wrapper: appProviders.wrapper},
    );

    const safeUnmount = async () => {
      await utils.unmount();
      await new Promise(res => setTimeout(res, 0));
    };
    onTeardown.unshift(safeUnmount);

    return utils;
  };

  it('shows badge when isLow is true', async () => {
    mockFreeBytes = 100 * 1024 * 1024;
    await renderHeader();

    await screen.findByTestId('HOME.header-button');

    expect(await screen.findByTestId('low-storage-badge')).toBeTruthy();
  });

  it('hides badge when isLow is false', async () => {
    mockFreeBytes = 600 * 1024 * 1024;
    await renderHeader();

    await screen.findByTestId('HOME.header-button');

    expect(screen.queryByTestId('low-storage-badge')).toBeNull();
  });
});
