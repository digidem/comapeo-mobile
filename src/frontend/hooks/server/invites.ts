import {useClientApi} from '@comapeo/core-react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {ROOT_QUERY_KEY} from '../../constants';

// Copied from comapeo-core-react (v3.2.0) [src/lib/react-query/invites.ts: L23-L25]
// Replicated here to ensure consistent query-key usage for pending invites.

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
