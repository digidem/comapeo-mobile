import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';

export const INVITE_KEY = 'pending_invites';

export function usePendingInvites() {
  const mapeoApi = useApi();
  return useSuspenseQuery({
    queryKey: [INVITE_KEY],
    queryFn: async () => {
      return await mapeoApi.invite.getPending();
    },
  });
}

export function useAcceptInvite() {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({inviteId}: {inviteId: string}) => {
      if (!inviteId) return;
      mapeoApi.invite.accept({inviteId});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    },
  });
}

export function useRejectInvite() {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({inviteId}: {inviteId: string}) => {
      mapeoApi.invite.reject({inviteId});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    },
  });
}

export function useClearAllPendingInvites() {
  const queryClient = useQueryClient();
  const mapeoApi = useApi();

  return useMutation({
    mutationFn: ({inviteIds}: {inviteIds: Array<string>}) => {
      return Promise.all(
        inviteIds.map(id => mapeoApi.invite.reject({inviteId: id})),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INVITE_KEY],
      });
    },
  });
}
