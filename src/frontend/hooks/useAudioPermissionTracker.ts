import {useMutation} from '@tanstack/react-query';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const AUDIO_PERMISSION_MODAL_KEY = [
  'background',
  'audio',
  'permission',
  'modal',
] as const;

export function useAudioPermissionModalMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: AUDIO_PERMISSION_MODAL_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}
