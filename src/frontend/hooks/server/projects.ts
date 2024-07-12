import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {useApi} from '../../contexts/ApiContext';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {usePersistedProjectId} from '../persistedState/usePersistedProjectId';

export const ALL_PROJECTS_KEY = 'all_projects';
export const PROJECT_SETTINGS_KEY = 'project_settings';
export const CREATE_PROJECT_KEY = 'create_project';
export const PROJECT_KEY = 'project';
export const PROJECT_MEMBERS_KEY = 'project_members';

export function useProject(projectId?: string) {
  const api = useApi();

  return useQuery({
    queryKey: [PROJECT_KEY, projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Active project ID must exist');
      return api.getProject(projectId);
    },
    enabled: !!projectId,
    placeholderData: previousData => previousData,
  });
}

export function useAllProjects() {
  const api = useApi();

  return useQuery({
    queryKey: [ALL_PROJECTS_KEY],
    queryFn: () => {
      return api.listProjects();
    },
  });
}

export function useCreateProject() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [CREATE_PROJECT_KEY],
    mutationFn: (opts?: {name?: string; configPath?: string}) => {
      if (opts) {
        return api.createProject(opts);
      } else {
        // Have to avoid passing `undefined` explicitly
        // See https://github.com/digidem/comapeo-mobile/issues/392
        return api.createProject();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_PROJECTS_KEY],
      });
    },
  });
}

export function useProjectMembers() {
  const project = useActiveProject();

  return useQuery({
    queryKey: [PROJECT_MEMBERS_KEY],
    queryFn: () => {
      return project.$member.getMany();
    },
  });
}

export function useProjectSettings() {
  const project = useActiveProject();

  return useQuery({
    queryKey: [PROJECT_SETTINGS_KEY],
    queryFn: () => {
      return project.$getProjectSettings();
    },
  });
}

export function useLeaveProject() {
  const mapeoApi = useApi();
  const projectId = usePersistedProjectId(store => store.projectId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!projectId) throw new Error('project Id does not exist');
      return mapeoApi.leaveProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_PROJECTS_KEY],
      });
    },
  });
}
