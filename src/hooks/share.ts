import {useMutation} from '@tanstack/react-query';
import Share, {type ShareOptions} from 'react-native-share';

// 'background' key prefix prevents passcode prompt during share dialog (see AuthContext.tsx)
const SHARE_OPEN_MUTATION_KEY = ['background', 'share', 'open'] as const;

export function useOpenShareDialog() {
  return useMutation({
    networkMode: 'always',
    retry: false,
    mutationKey: SHARE_OPEN_MUTATION_KEY,
    mutationFn: async (options: ShareOptions) => {
      return Share.open(options);
    },
  });
}
