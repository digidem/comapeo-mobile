import {useClientApi} from '@comapeo/core-react';
import {useSuspenseQuery} from '@tanstack/react-query';

export const INVITE_KEY = 'pending_invites';

export function usePendingInvites() {
  const mapeoApi = useClientApi();
  return useSuspenseQuery({
    queryKey: [INVITE_KEY],
    queryFn: async () => {
      return await mapeoApi.invite.getPending();
    },
  });
}
