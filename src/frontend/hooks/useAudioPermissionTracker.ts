import {useMutation, useIsMutating} from '@tanstack/react-query';

const AUDIO_PERMISSION_MODAL_KEY = ['audio', 'permission', 'modal'] as const;

export function useAudioPermissionModalMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: AUDIO_PERMISSION_MODAL_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}

export function useIsAudioPermissionModalOpen(): boolean {
  return (
    useIsMutating({
      mutationKey: AUDIO_PERMISSION_MODAL_KEY,
      status: 'pending',
    }) > 0
  );
}
