import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {PROJECTS_KEY, useProject, useUpdateActiveProjectId} from './projects';

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

export function useAcceptInvite(projectId?: string) {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();
  const switchActiveProject = useUpdateActiveProjectId();
  console.log({projectId});
  return useMutation({
    mutationFn: async ({inviteId}: {inviteId: string}) => {
      if (!inviteId) return;
      mapeoApi.invite.accept({inviteId});
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient
          .invalidateQueries({queryKey: [INVITE_KEY, PROJECTS_KEY]})
          .then(() => {
            if (projectId) {
              switchActiveProject(projectId);
            }
          });
      }, 5000);
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

export function useSendInvite() {
  const queryClient = useQueryClient();
  const project = useProject();
  type InviteParams = Parameters<typeof project.$member.invite>;
  return useMutation({
    mutationFn: ({
      deviceId,
      role,
    }: {
      deviceId: InviteParams[0];
      role: InviteParams[1];
    }) => project.$member.invite(deviceId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    },
  });
}

export function useRequestCancelInvite() {
  const queryClient = useQueryClient();
  const project = useProject();
  return useMutation({
    mutationFn: (deviceId: string) =>
      project.$member.requestCancelInvite(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    },
  });
}
