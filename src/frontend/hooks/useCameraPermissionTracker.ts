import {useMutation} from '@tanstack/react-query';
import {Camera, type CameraPermissionStatus} from 'react-native-vision-camera';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const CAMERA_PERMISSION_KEY = ['background', 'camera', 'permission'] as const;

export function useCameraPermissionMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: CAMERA_PERMISSION_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}

export type CameraPermission = {granted: boolean; canAskAgain: boolean};

// Android reports "never asked" and "permanently denied" identically, so the
// first Allow after a relaunch is a guess. If someone taps Allow and no
// dialog appears, the button immediately becomes Open Settings.
let hasRequestedCamera = false;

function markCameraRequested() {
  hasRequestedCamera = true;
}

export function cameraPermissionFrom(
  status: CameraPermissionStatus,
  hasRequested: boolean,
): CameraPermission {
  return {
    granted: status === 'granted',
    canAskAgain: status === 'not-determined' || !hasRequested,
  };
}

export function readCameraPermission(): CameraPermission {
  return cameraPermissionFrom(
    Camera.getCameraPermissionStatus(),
    hasRequestedCamera,
  );
}

export async function requestCameraPermission(): Promise<CameraPermission> {
  await Camera.requestCameraPermission();
  markCameraRequested();
  return cameraPermissionFrom(Camera.getCameraPermissionStatus(), true);
}
