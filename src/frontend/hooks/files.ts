import {useMutation} from '@tanstack/react-query';

import {selectFile} from '../lib/file-system';

export function useSelectFile() {
  return useMutation({
    mutationFn: (opts: Parameters<typeof selectFile>[0]) => {
      return selectFile(opts);
    },
  });
}
