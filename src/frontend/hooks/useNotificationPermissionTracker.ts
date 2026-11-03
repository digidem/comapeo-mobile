import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const NOTIFICATION_PERMISSION_MUTATION_KEY = [
  'background',
  'notification',
  'permission',
] as const;

const NOTIFICATION_PERMISSION_QUERY_KEY = [
  'permission',
  'notification',
] as const;

export function useNotificationPermissionQuery() {
  return useSuspenseQuery({
    queryKey: NOTIFICATION_PERMISSION_QUERY_KEY,
    queryFn: readNotificationPermission,
  });
}

export function useInvalidateNotificationPermission() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: NOTIFICATION_PERMISSION_QUERY_KEY,
    });
}

export function useNotificationPermissionWithoutPasscode<T>(
  fn: () => Promise<T>,
) {
  return useMutation({
    mutationKey: NOTIFICATION_PERMISSION_MUTATION_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}

// Not the core module's getNotificationPermissionsAsync, which hardcodes granted on iOS.
export async function readNotificationPermission() {
  const {granted, canAskAgain} = await Notifications.getPermissionsAsync();
  return {granted, canAskAgain};
}

// Returns nothing on purpose. What the request resolves with can disagree with
// what a later read reports, so the query stays the only source of truth and
// callers invalidate it instead of storing this.
export async function requestNotificationPermission() {
  await Notifications.requestPermissionsAsync();
}
