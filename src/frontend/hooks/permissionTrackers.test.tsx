import * as React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {useCameraPermissionWithoutPasscode} from './useCameraPermissionTracker';
import {useLocationPermissionWithoutPasscode} from './useLocationPermissionTracker';

// Android reports a never-asked permission as "denied", exactly like a
// permanently denied one, so the "have we asked" flag is what
// separates them.
//
// That flag lives for the life of the module, so each case needs a fresh copy.
function freshCameraTracker(status: string) {
  jest.resetModules();
  const {Camera} = jest.requireMock('react-native-vision-camera') as {
    Camera: {
      getCameraPermissionStatus: jest.Mock;
      requestCameraPermission: jest.Mock;
    };
  };
  Camera.getCameraPermissionStatus.mockReturnValue(status);
  Camera.requestCameraPermission.mockResolvedValue(status);
  return jest.requireActual(
    './useCameraPermissionTracker',
  ) as typeof import('./useCameraPermissionTracker');
}

test('camera: granted', async () => {
  const tracker = freshCameraTracker('granted');

  expect(tracker.readCameraPermission().granted).toBe(true);
});

test('camera: fresh install offers Allow even though Android says denied', async () => {
  const tracker = freshCameraTracker('denied');

  expect(tracker.readCameraPermission().canAskAgain).toBe(true);
});

test('camera: still offers Allow after a single denial', async () => {
  const tracker = freshCameraTracker('not-determined');
  await tracker.requestCameraPermission();

  expect(tracker.readCameraPermission().canAskAgain).toBe(true);
});

test('camera: falls back to Settings once denied for good', async () => {
  const tracker = freshCameraTracker('denied');
  await tracker.requestCameraPermission();

  expect(tracker.readCameraPermission().canAskAgain).toBe(false);
});

// AuthContext suppresses the passcode screen while any mutation with the key
// ['background', ...] is pending.
test('permission requests hide the passcode screen', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const neverResolves = () => new Promise<void>(() => {});
  const {result} = await renderHook(
    () => ({
      camera: useCameraPermissionWithoutPasscode(neverResolves),
      location: useLocationPermissionWithoutPasscode(neverResolves),
    }),
    {wrapper},
  );

  const pending = () =>
    queryClient
      .getMutationCache()
      .findAll({mutationKey: ['background'], status: 'pending'});

  expect(pending()).toHaveLength(0);

  act(() => {
    result.current.camera.mutate();
    result.current.location.mutate();
  });

  await waitFor(() => expect(pending()).toHaveLength(2));
});
