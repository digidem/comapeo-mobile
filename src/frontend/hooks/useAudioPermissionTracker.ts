import {useMutation} from '@tanstack/react-query';

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
