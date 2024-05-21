import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {useActiveProjectContext} from '../../contexts/ProjectContext';

export const PROJECT_KEY = 'project';
export const ALL_PROJECTS_KEY = 'all_projects';
export const PROJECT_SETTINGS_KEY = 'project_settings';

export function useUpdateActiveProjectId() {
  const projectContext = useActiveProjectContext();
  return projectContext.switchProject;
}

export function useProject() {
  const projectContext = useActiveProjectContext();
  return projectContext.project;
}

export function useAllProjects() {
  const api = useApi();

  return useQuery({
    queryFn: async () => await api.listProjects(),
    queryKey: [ALL_PROJECTS_KEY],
  });
}

export function useCreateProject() {
  const api = useApi();
  const queryClient = useQueryClient();
  const updateProject = useUpdateActiveProjectId();

  return useMutation({
    mutationKey: ['createProject'],
    mutationFn: async (name: string) => {
      return await api.createProject({name});
    },
    onSuccess: async data => {
      updateProject(data);
      return await queryClient.invalidateQueries({
        queryKey: [ALL_PROJECTS_KEY],
      });
    },
  });
}

export function useProjectMembers() {
  const project = useProject();
  return useQuery({
    queryFn: async () => {
      return await project.$member.getMany();
    },
    queryKey: ['projectMembers'],
  });
}

export function useProjectSettings() {
  const project = useProject();

  return useQuery({
    queryKey: [PROJECT_SETTINGS_KEY],
    queryFn: () => {
      return project.$getProjectSettings();
    },
  });
}

export function useImportProjectConfig() {
  const queryClient = useQueryClient();
  const project = useProject();

  return useMutation({
    mutationFn: (configPath: string) => {
      return project.importConfig({configPath});
    },
    onSuccess: () => {
      // TODO: Invalidate project query too (easier to do when https://github.com/digidem/comapeo-mobile/pull/363 is merged)
      return queryClient.invalidateQueries({queryKey: [PROJECT_SETTINGS_KEY]});
    },
  });
}
