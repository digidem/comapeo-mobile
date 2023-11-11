import {useSuspenseQuery} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {useActiveProjectContext} from '../../contexts/ProjectContext';
import {usePersistedProjectId} from '../persistedState/usePersistedProjectId';

/**
 * This function guarantees that a non empty list of projects is returned. In otherwords,if there are no projects, it creates one.
 */
export function listProjects() {
  const api = useApi();
  const {data} = useSuspenseQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const allProjects = await api.listProjects();
      if (allProjects.length !== 0) {
        return allProjects;
      }
      await api.createProject();
      return await api.listProjects();
    },
  });
  return data;
}

export function useActiveProject() {
  const allProjects = listProjects();
  const activeProjectId = usePersistedProjectId(store => store.projectId);
  const setProjectId = usePersistedProjectId(store => store.setProjectId);
  const api = useApi();

  const {data} = useSuspenseQuery({
    queryKey: ['project'],
    queryFn: async () => {
      if (!activeProjectId) {
        const defaultProjectId = allProjects[0].projectId;
        setProjectId(defaultProjectId);
        return await api.getProject(defaultProjectId);
      }
      return await api.getProject(activeProjectId);
    },
  });

  return data;
}
