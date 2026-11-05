import * as React from 'react';
import type {SyncState} from '@comapeo/core-react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {ExchangeScreenContent} from './ExchangeScreenContent';

let mockDataSyncProgress: number | null = null;

const mockSync = {
  connectServers: jest.fn(),
  disconnectServers: jest.fn(),
  setAutostopDataSyncTimeout: jest.fn(),
  stop: jest.fn(),
};

jest.mock('@comapeo/core-react', () => ({
  ...jest.requireActual('@comapeo/core-react'),
  useDataSyncProgress: () => mockDataSyncProgress,
  useIsArchiveDevice: () => ({data: false}),
  useStartSync: () => ({mutate: jest.fn()}),
}));

jest.mock('../../contexts/ActiveProjectContext', () => ({
  useActiveProject: () => ({
    projectId: 'project-id',
    projectApi: {$sync: mockSync},
  }),
}));

jest.mock('../../hooks/server/projects', () => ({
  useActiveArchiveServer: () => undefined,
}));

jest.mock('../../hooks/useLocalDiscoveryState', () => ({
  useLocalDiscoveryState: () => 'CoMapeo Test Wi-Fi',
}));

const serverPeerSyncState = {
  initial: {isSyncEnabled: true, want: 0, wanted: 0},
  data: {isSyncEnabled: true, want: 5, wanted: 0},
};

const syncingWithServer = {
  initial: {isSyncEnabled: true},
  data: {isSyncEnabled: true},
  remoteDeviceSyncState: {server: serverPeerSyncState},
} satisfies SyncState;

const Stack = createNativeStackNavigator<{Sync: undefined}>();

const queryClient = new QueryClient();

const Wrapper = ({children}: {children: React.ReactNode}) => (
  <QueryClientProvider client={queryClient}>
    <IntlProvider locale="en">{children}</IntlProvider>
  </QueryClientProvider>
);

async function renderExchangeScreen(syncState: SyncState) {
  const {unmount} = await render(
    <React.Suspense fallback={null}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Sync">
            {() => <ExchangeScreenContent syncState={syncState} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </React.Suspense>,
    {wrapper: Wrapper},
  );
  return unmount;
}

describe('ExchangeScreenContent server connection on leaving the screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('keeps the server connected while data sync is still in progress', async () => {
    mockDataSyncProgress = 0.4;
    const unmount = await renderExchangeScreen(syncingWithServer);

    await expect(screen.findByText('Exchanging...')).resolves.toBeVisible();
    expect(mockSync.connectServers).toHaveBeenCalled();

    await unmount();

    expect(mockSync.disconnectServers).not.toHaveBeenCalled();
  });

  test('disconnects the server once data sync is complete', async () => {
    mockDataSyncProgress = 1;
    const unmount = await renderExchangeScreen(syncingWithServer);

    await expect(screen.findByText('Complete!')).resolves.toBeVisible();

    await unmount();

    expect(mockSync.disconnectServers).toHaveBeenCalledTimes(1);
  });

  test('disconnects the server when data sync is not enabled', async () => {
    mockDataSyncProgress = null;
    const unmount = await renderExchangeScreen({
      ...syncingWithServer,
      data: {isSyncEnabled: false},
    });

    await expect(screen.findByText('Devices found.')).resolves.toBeVisible();

    await unmount();

    expect(mockSync.disconnectServers).toHaveBeenCalledTimes(1);
  });
});
