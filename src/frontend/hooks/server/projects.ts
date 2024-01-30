import {useQuery} from '@tanstack/react-query';
import {useActiveProjectContext} from '../../contexts/ProjectContext';

export function useUpdateActiveProjectId() {
  const projectContext = useActiveProjectContext();
  return projectContext.switchProject;
}

export function useProject() {
  const projectContext = useActiveProjectContext();
  return projectContext.project;
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
