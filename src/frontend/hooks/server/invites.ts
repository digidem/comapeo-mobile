import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import {useApi} from '../../contexts/ApiContext';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {usePersistedProjectId} from '../persistedState/usePersistedProjectId';
import {ALL_PROJECTS_KEY} from './projects';

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
  const switchActiveProject = usePersistedProjectId(
    state => state.setProjectId,
  );

  return useMutation({
    mutationFn: async ({inviteId}: {inviteId: string}) => {
      if (!inviteId) return;
      return mapeoApi.invite.accept({inviteId});
    },
    onSuccess: () => {
      // This is a workaround. There is a race condition where the project in not available when the invite is accepted. This is temporary and is currently being worked on.
      setTimeout(() => {
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: [INVITE_KEY],
          }),
          queryClient.invalidateQueries({
            queryKey: [ALL_PROJECTS_KEY],
          }),
        ]).then(() => {
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
  const project = useActiveProject();
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
  const project = useActiveProject();
  return useMutation({
    mutationFn: (deviceId: string) =>
      project.$member.requestCancelInvite(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    },
  });
}
