import {useMutation} from '@tanstack/react-query';

import {selectFile} from '../lib/file-system';

// 'background' key prefix prevents passcode prompt during file selection (see AuthContext.tsx)
export const FILE_SELECT_MUTATION_KEY = [
  'background',
  'file',
  'select',
] as const;

export function useSelectFile() {
  return useMutation({
    mutationKey: FILE_SELECT_MUTATION_KEY,
    mutationFn: (opts: Parameters<typeof selectFile>[0]) => {
      return selectFile(opts);
    },
  });
}
