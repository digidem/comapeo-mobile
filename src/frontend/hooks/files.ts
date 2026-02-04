import {useMutation, useIsMutating} from '@tanstack/react-query';

import {selectFile} from '../lib/file-system';

const FILE_SELECT_MUTATION_KEY = ['file', 'select'] as const;

export function useSelectFile() {
  return useMutation({
    mutationKey: FILE_SELECT_MUTATION_KEY,
    mutationFn: (opts: Parameters<typeof selectFile>[0]) => {
      return selectFile(opts);
    },
  });
}

export function useIsFileSelectionOpen(): boolean {
  return (
    useIsMutating({
      mutationKey: FILE_SELECT_MUTATION_KEY,
      status: 'pending',
    }) > 0
  );
}
