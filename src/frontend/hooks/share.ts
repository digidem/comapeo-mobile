import {useIsMutating, useMutation} from '@tanstack/react-query';
import Share, {type ShareOptions} from 'react-native-share';
import {saveDocument} from '../../../modules/action-create-document/src/CreateDocumentModule';

const SHARE_OPEN_MUTATION_KEY = ['share', 'open'] as const;

export function useOpenShareDialog() {
  return useMutation({
    networkMode: 'always',
    retry: false,
    mutationKey: SHARE_OPEN_MUTATION_KEY,
    mutationFn: async (options: ShareOptions) => {
      return saveDocument(options.url, {
        mimeType: 'application/json',
      }).catch(error => {
        console.error('Error saving document for sharing:', error);
        throw error;
      });
    },
  });
}

export function useIsShareDialogOpen() {
  return (
    useIsMutating({
      mutationKey: SHARE_OPEN_MUTATION_KEY,
      status: 'pending',
    }) > 0
  );
}
