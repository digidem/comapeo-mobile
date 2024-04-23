import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {useActiveProjectContext} from '../../contexts/ProjectContext';

export const PROJECTS_KEY = 'all_projects';

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
    queryKey: [PROJECTS_KEY],
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
      return await queryClient.invalidateQueries({queryKey: ['projects']});
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
    queryFn: async () => {
      return await project.$getProjectSettings();
    },
    queryKey: ['projectSettings'],
  });
}
