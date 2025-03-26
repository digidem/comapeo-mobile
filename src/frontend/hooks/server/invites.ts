import {useClientApi} from '@comapeo/core-react';
import {useSuspenseQuery} from '@tanstack/react-query';
const ROOT_QUERY_KEY = '@comapeo/core-react';

function getPendingInvitesQueryKey() {
  return [ROOT_QUERY_KEY, 'invites', {status: 'pending'}] as const;
}

export function usePendingInvites() {
  const mapeoApi = useClientApi();
  return useSuspenseQuery({
    queryKey: getPendingInvitesQueryKey(),
    queryFn: async () => {
      return await mapeoApi.invite.getPending();
    },
  });
}
