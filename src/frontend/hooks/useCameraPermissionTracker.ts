import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {Camera, type CameraPermissionStatus} from 'react-native-vision-camera';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const CAMERA_PERMISSION_MUTATION_KEY = [
  'background',
  'camera',
  'permission',
] as const;

const CAMERA_PERMISSION_QUERY_KEY = ['permission', 'camera'] as const;

export function useCameraPermissionQuery() {
  return useSuspenseQuery({
    queryKey: CAMERA_PERMISSION_QUERY_KEY,
    queryFn: readCameraPermission,
  });
}

export function useInvalidateCameraPermission() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({queryKey: CAMERA_PERMISSION_QUERY_KEY});
}

export function useCameraPermissionMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: CAMERA_PERMISSION_MUTATION_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}

// Android reports "never asked" and "permanently denied" identically, so the
// first Allow after a relaunch is a guess. If someone taps Allow and no
// dialog appears, the button immediately becomes Open Settings.
let hasRequestedCamera = false;

export function cameraPermissionFrom(
  status: CameraPermissionStatus,
  hasRequested: boolean,
) {
  return {
    granted: status === 'granted',
    canAskAgain: status === 'not-determined' || !hasRequested,
  };
}

export function readCameraPermission() {
  return cameraPermissionFrom(
    Camera.getCameraPermissionStatus(),
    hasRequestedCamera,
  );
}

// Returns nothing on purpose, so the query stays the only source of truth and
// callers invalidate it rather than storing what the request resolved with.
export async function requestCameraPermission() {
  await Camera.requestCameraPermission();
  hasRequestedCamera = true;
}
