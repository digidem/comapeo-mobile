import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';

export const INVITE_KEY = 'invites';

export function usePendingInvites() {
  const mapeoApi = useApi();
  return useSuspenseQuery({
    queryKey: [INVITE_KEY],
    queryFn: async () => {
      return await mapeoApi.invite.getPending();
    },
  });
}

export function useAcceptInvite(inviteId?: string) {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [INVITE_KEY, inviteId],
    mutationFn: async () => {
      if (!inviteId) return;
      mapeoApi.invite.accept({inviteId});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY, inviteId]});
    },
  });
}

export function useRejectInvite(inviteId?: string) {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [INVITE_KEY, inviteId],
    mutationFn: async () => {
      if (!inviteId) return;
      mapeoApi.invite.reject({inviteId});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY, inviteId]});
    },
  });
}
