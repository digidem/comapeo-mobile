import {useMutation} from '@tanstack/react-query';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const LOCATION_PERMISSION_MODAL_KEY = [
  'background',
  'location',
  'permission',
  'modal',
] as const;

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)

export function useLocationPermissionModalMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: LOCATION_PERMISSION_MODAL_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}
