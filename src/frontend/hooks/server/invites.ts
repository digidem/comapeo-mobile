import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {useApi} from '../../contexts/ApiContext';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {usePersistedProjectId} from '../persistedState/usePersistedProjectId';
import {ALL_PROJECTS_KEY, PROJECT_MEMBERS_KEY} from './projects';

export const INVITE_KEY = 'pending_invites';

export function usePendingInvites() {
  const mapeoApi = useApi();
  return useQuery({
    queryKey: [INVITE_KEY],
    queryFn: async () => {
      return await mapeoApi.invite.getPending();
    },
  });
}

export function useAcceptInvite() {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();

  const switchActiveProject = usePersistedProjectId(
    state => state.setProjectId,
  );

  return useMutation({
    mutationFn: async ({inviteId}: {inviteId: string}) => {
      return mapeoApi.invite.accept({inviteId});
    },
    onSuccess: projectPublicId => {
      queryClient.invalidateQueries({
        queryKey: [INVITE_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [ALL_PROJECTS_KEY],
      });

      switchActiveProject(projectPublicId);
    },
  });
}

export function useRejectInvite() {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({inviteId}: {inviteId: string}) => {
      return mapeoApi.invite.reject({inviteId});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    },
  });
}

export function useSendInvite() {
  const queryClient = useQueryClient();
  const {projectApi} = useActiveProject();
  type InviteParams = Parameters<typeof projectApi.$member.invite>;
  return useMutation({
    mutationFn: ({
      deviceId,
      role,
    }: {
      deviceId: InviteParams[0];
      role: InviteParams[1];
    }) => projectApi.$member.invite(deviceId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
      queryClient.invalidateQueries({queryKey: [PROJECT_MEMBERS_KEY]});
    },
  });
}

export function useRequestCancelInvite() {
  const queryClient = useQueryClient();
  const {projectApi} = useActiveProject();
  return useMutation({
    mutationFn: (deviceId: string) =>
      projectApi.$member.requestCancelInvite(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    },
  });
}
