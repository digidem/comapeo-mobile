import React from 'react';
import {useCameraPermission} from 'react-native-vision-camera';
import {useMutation} from '@tanstack/react-query';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const CAMERA_PERMISSION_MUTATION_KEY = [
  'background',
  'camera',
  'permission',
] as const;

export function useCameraPermissionMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: CAMERA_PERMISSION_MUTATION_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}

export function useRequestCameraPermissionOnMount() {
  const {hasPermission, requestPermission} = useCameraPermission();
  const {mutateAsync} = useCameraPermissionMutation(requestPermission);

  React.useEffect(() => {
    if (!hasPermission) {
      mutateAsync();
    }
  }, [hasPermission, mutateAsync]);

  return {hasPermission};
}
