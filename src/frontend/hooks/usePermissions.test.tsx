import * as React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {afterEach} from '@jest/globals';

import {useLocationPermission} from './usePermissions';

let mockResolveRequest: (value: {
  granted: boolean;
  canAskAgain: boolean;
}) => void;

jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({granted: false, canAskAgain: true}),
  ),
  requestForegroundPermissionsAsync: jest.fn(
    () =>
      new Promise(resolve => {
        mockResolveRequest = resolve;
      }),
  ),
}));

const clients: QueryClient[] = [];

afterEach(() => {
  clients.splice(0).forEach(client => {
    client.unmount();
    client.clear();
  });
});

async function renderPermission() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false, gcTime: 0}},
  });
  clients.push(queryClient);
  const wrapper = ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const rendered = await renderHook(() => useLocationPermission(), {wrapper});
  return {queryClient, ...rendered};
}

function pendingBackgroundMutations(queryClient: QueryClient) {
  return queryClient
    .getMutationCache()
    .findAll({mutationKey: ['background'], status: 'pending'});
}

test('reads the permission and offers to ask when it is not granted', async () => {
  const {result} = await renderPermission();

  await waitFor(() => expect(result.current.state).toBe('askable'));
});

// AuthContext suppresses the passcode screen while any mutation keyed
// ['background', ...] is pending. If that key is changed, a person
// gets the passcode screen on top of the system permission dialog.
test('keeps the passcode screen suppressed while the system dialog is up', async () => {
  const {result, queryClient} = await renderPermission();
  await waitFor(() => expect(result.current.state).toBe('askable'));

  expect(pendingBackgroundMutations(queryClient)).toHaveLength(0);

  act(() => {
    result.current.request();
  });

  await waitFor(() =>
    expect(pendingBackgroundMutations(queryClient)).toHaveLength(1),
  );

  await act(async () => {
    mockResolveRequest({granted: true, canAskAgain: true});
  });

  await waitFor(() => {
    expect(pendingBackgroundMutations(queryClient)).toHaveLength(0);
    expect(result.current.state).toBe('granted');
  });
});
