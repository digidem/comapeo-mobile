import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import * as Location from 'expo-location';
import {Camera, type CameraPermissionStatus} from 'react-native-vision-camera';
import * as Sentry from '@sentry/react-native';
import {openSettingsAndWait} from '../utils/linking';

/**
 * askable = the system will still show its dialog. blocked = it won't, only
 * Settings can change it.
 */
export type PermissionState = 'pending' | 'granted' | 'askable' | 'blocked';

type PermissionSnapshot = {granted: boolean; canAskAgain: boolean};

export type Permission = {
  state: PermissionState;
  request: () => Promise<void>;
  openSettings: () => Promise<void>;
};

// 'background' key prefix prevents asking for a passcode while the system permission
// dialog or Settings is being used (see AuthContext.tsx)
const LOCATION_KEY = ['background', 'permission', 'location'] as const;
const CAMERA_KEY = ['background', 'permission', 'camera'] as const;
function toState(snapshot: PermissionSnapshot | undefined): PermissionState {
  if (!snapshot) return 'pending';
  if (snapshot.granted) return 'granted';
  return snapshot.canAskAgain ? 'askable' : 'blocked';
}

/**
 * focusManager is wired to AppState in App.tsx, so this re-reads the permission
 * when the app comes back from the system dialog or Settings.
 */
function usePermission({
  queryKey,
  get,
  request,
}: {
  queryKey: QueryKey;
  get: () => Promise<PermissionSnapshot>;
  request: () => Promise<PermissionSnapshot>;
}): Permission {
  const queryClient = useQueryClient();

  // The rule wants `get` in the queryKey. Each hook passes its own queryKey and
  // `get` together so they can't get out of sync, and `get` is a new function
  // every render, so keying on it would throw the cache away each time.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  const {data} = useQuery({
    queryKey,
    // If reading the permission fails, don't leave users stuck on a loading
    // spinner. Falling back to askable shows Allow so users can try again.
    queryFn: () =>
      get().catch(err => {
        Sentry.captureException(err);
        return {granted: false, canAskAgain: true};
      }),
  });

  const requestMutation = useMutation({
    mutationKey: [...queryKey, 'request'],
    mutationFn: request,
    networkMode: 'always',
    onSuccess: snapshot => queryClient.setQueryData(queryKey, snapshot),
    onError: (err: Error) => Sentry.captureException(err),
  });

  const openSettingsMutation = useMutation({
    mutationKey: [...queryKey, 'openSettings'],
    mutationFn: openSettingsAndWait,
    networkMode: 'always',
    onError: (err: Error) => Sentry.captureException(err),
  });

  // onError above already sent any failure to Sentry. Catching it here as well
  // stops a failed press logging an unhandled promise rejection warning.
  return {
    state: toState(data),
    request: async () => {
      await requestMutation.mutateAsync().catch(() => {});
    },
    openSettings: async () => {
      await openSettingsMutation.mutateAsync().catch(() => {});
    },
  };
}

export function useLocationPermission() {
  return usePermission({
    queryKey: LOCATION_KEY,
    get: async () => {
      const {granted, canAskAgain} =
        await Location.getForegroundPermissionsAsync();
      return {granted, canAskAgain};
    },
    request: async () => {
      const {granted, canAskAgain} =
        await Location.requestForegroundPermissionsAsync();
      return {granted, canAskAgain};
    },
  });
}

// Android reports "never asked" and "permanently denied" identically, so the
// first Allow after the android process is killed is a guess. If someone taps Allow and nothing happens then, the
// button immediately becomes Open Settings.
let hasRequestedCamera = false;

function markCameraRequested() {
  hasRequestedCamera = true;
}

export function cameraSnapshot(
  status: CameraPermissionStatus,
  hasRequested: boolean,
): PermissionSnapshot {
  return {
    granted: status === 'granted',
    canAskAgain: status === 'not-determined' || !hasRequested,
  };
}

export function useCameraPermission() {
  return usePermission({
    queryKey: CAMERA_KEY,
    get: async () =>
      cameraSnapshot(Camera.getCameraPermissionStatus(), hasRequestedCamera),
    request: async () => {
      await Camera.requestCameraPermission();
      markCameraRequested();
      return cameraSnapshot(Camera.getCameraPermissionStatus(), true);
    },
  });
}
