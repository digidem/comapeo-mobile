import * as React from 'react';
import {renderHook, waitFor} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {afterEach} from '@jest/globals';
import {Camera} from 'react-native-vision-camera';

import {cameraSnapshot, useCameraPermission} from './usePermissions';

// Android reports a never-asked permission as `denied`, exactly like a
// permanently denied one,
test.each([
  ['granted', false, {granted: true, canAskAgain: true}],
  ['denied', false, {granted: false, canAskAgain: true}], // fresh install
  ['not-determined', true, {granted: false, canAskAgain: true}], // denied once
  ['denied', true, {granted: false, canAskAgain: false}], // denied for good
] as const)('%s with hasRequested=%s', (status, hasRequested, expected) => {
  expect(cameraSnapshot(status, hasRequested)).toEqual(expected);
});

const clients: QueryClient[] = [];

afterEach(() => {
  clients.splice(0).forEach(client => {
    client.unmount();
    client.clear();
  });
});

async function renderCameraPermission() {
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false, gcTime: 0}},
  });
  clients.push(queryClient);
  const wrapper = ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useCameraPermission(), {wrapper});
}

test('offers Allow first, then Settings once the system refuses to ask', async () => {
  (Camera.getCameraPermissionStatus as jest.Mock).mockReturnValue('denied');
  (Camera.requestCameraPermission as jest.Mock).mockResolvedValue('denied');

  const {result} = await renderCameraPermission();
  await waitFor(() => expect(result.current.state).toBe('askable'));

  await result.current.request();

  await waitFor(() => expect(result.current.state).toBe('blocked'));
});
