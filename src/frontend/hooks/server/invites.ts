import {useSuspenseQuery} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';

export const INVITE_KEY = 'invites';

export function useInvites() {
  const mapeoApi = useApi();
  return useSuspenseQuery({
    queryKey: [INVITE_KEY],
    queryFn: async () => {
      return await mapeoApi.invite.getPending();
    },
  });
}
