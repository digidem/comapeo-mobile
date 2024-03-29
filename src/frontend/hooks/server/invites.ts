import {useMutation, useSuspenseQuery} from '@tanstack/react-query';
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

export function useAcceptInvite(inviteId: string) {
  const mapeoApi = useApi();
  return useMutation({
    mutationKey: [INVITE_KEY, inviteId],
    mutationFn: async () => {
      mapeoApi.invite.accept({inviteId});
    },
  });
}

export function useRejectInvite(inviteId: string) {
  const mapeoApi = useApi();
  const invites = useInvites().data;
  return useMutation({
    mutationKey: [INVITE_KEY, inviteId],
    mutationFn: async () => {
      mapeoApi.invite.reject({inviteId});
    },
    onSuccess: () => {
      //clears all pending invites after user accepts an invite
      Promise.allSettled(invites.map(inv => mapeoApi.invite.reject(inv)));
    },
  });
}
