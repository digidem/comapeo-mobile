import {useQuery} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {useActiveProjectContext} from '../../contexts/ProjectContext';

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
    queryKey: ['projects'],
    throwOnError: true,
  });
}
