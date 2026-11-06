import * as React from 'react';
import type {SyncState} from '@comapeo/core-react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {act, render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';
import {Text} from 'react-native';

import {ExchangeScreenContent} from './ExchangeScreenContent';

const mockConnectServers = jest.fn();
const mockDisconnectServers = jest.fn();
const mockSetAutostopDataSyncTimeout = jest.fn();

jest.mock('@comapeo/core-react', () => ({
  ...jest.requireActual('@comapeo/core-react'),
  useDataSyncProgress: () => null,
  useIsArchiveDevice: () => ({data: false}),
  useStartSync: () => ({mutate: jest.fn()}),
  useStopSync: () => ({mutate: jest.fn()}),
  useConnectSyncServers: () => ({mutate: mockConnectServers}),
  useDisconnectSyncServers: () => ({mutate: mockDisconnectServers}),
  useSetAutostopDataSyncTimeout: () => ({
    mutate: mockSetAutostopDataSyncTimeout,
  }),
}));

jest.mock('../../contexts/ActiveProjectContext', () => ({
  useActiveProject: () => ({projectId: 'project-id'}),
}));

jest.mock('../../hooks/server/projects', () => ({
  useActiveArchiveServer: () => undefined,
}));

jest.mock('../../hooks/useLocalDiscoveryState', () => ({
  useLocalDiscoveryState: () => 'CoMapeo Test Wi-Fi',
}));

const syncState = {
  initial: {isSyncEnabled: true},
  data: {isSyncEnabled: false},
  remoteDeviceSyncState: {},
} satisfies SyncState;

type StackParams = {Sync: undefined; Other: undefined};

const Stack = createNativeStackNavigator<StackParams>();

const queryClient = new QueryClient();

const Wrapper = ({children}: {children: React.ReactNode}) => (
  <QueryClientProvider client={queryClient}>
    <IntlProvider locale="en">{children}</IntlProvider>
  </QueryClientProvider>
);

test('connects servers on focus and disconnects them on blur', async () => {
  const navigationRef = createNavigationContainerRef<StackParams>();

  await render(
    <React.Suspense fallback={null}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Sync">
            {() => <ExchangeScreenContent syncState={syncState} />}
          </Stack.Screen>
          <Stack.Screen name="Other">{() => <Text>Other</Text>}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </React.Suspense>,
    {wrapper: Wrapper},
  );

  await expect(screen.findByText('No devices found.')).resolves.toBeVisible();

  expect(mockSetAutostopDataSyncTimeout).toHaveBeenCalledTimes(1);
  expect(mockSetAutostopDataSyncTimeout).toHaveBeenCalledWith({after: null});
  expect(mockConnectServers).toHaveBeenCalledTimes(1);
  expect(mockDisconnectServers).not.toHaveBeenCalled();

  await act(async () => {
    navigationRef.navigate('Other');
  });

  await expect(screen.findByText('Other')).resolves.toBeVisible();

  expect(mockDisconnectServers).toHaveBeenCalledTimes(1);
  expect(mockConnectServers).toHaveBeenCalledTimes(1);
});
