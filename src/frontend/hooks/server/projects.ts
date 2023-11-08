import {useActiveProjectContext} from '../../contexts/ProjectContext';

export function useUpdateActiveProjectId() {
  const projectContext = useActiveProjectContext();
  return projectContext.switchProject;
}

export function useProject() {
  const projectContext = useActiveProjectContext();
  return projectContext.project;
}
