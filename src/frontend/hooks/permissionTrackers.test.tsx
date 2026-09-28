import * as React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {
  cameraPermissionFrom,
  useCameraPermissionMutation,
} from './useCameraPermissionTracker';
import {useLocationPermissionMutation} from './useLocationPermissionTracker';

test.each([
  ['granted', false, {granted: true, canAskAgain: true}],
  ['denied', false, {granted: false, canAskAgain: true}], // fresh install
  ['not-determined', true, {granted: false, canAskAgain: true}], // denied once
  ['denied', true, {granted: false, canAskAgain: false}], // denied for good
] as const)(
  'camera: %s with hasRequested=%s',
  (status, hasRequested, expected) => {
    expect(cameraPermissionFrom(status, hasRequested)).toEqual(expected);
  },
);

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
      camera: useCameraPermissionMutation(neverResolves),
      location: useLocationPermissionMutation(neverResolves),
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
