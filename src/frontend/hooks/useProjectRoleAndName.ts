import {useOwnRoleInProject} from '@comapeo/core-react';
import {useProjectSettings} from './server/projects';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';

type ProjectRole = 'solo' | 'coordinator' | 'participant';

export function useProjectRoleAndName(projectId: string): {
  role: ProjectRole;
  projectName: string;
} {
  const {data: projectData} = useProjectSettings();
  const {data: roleData} = useOwnRoleInProject({projectId: projectId});
  const projectName = projectData?.name ?? 'My Solo Project';
  let role: ProjectRole = 'solo';
  if (!projectData?.name || !roleData?.roleId) {
    role = 'solo';
  } else if (
    roleData.roleId === COORDINATOR_ROLE_ID ||
    roleData.roleId === CREATOR_ROLE_ID
  ) {
    role = 'coordinator';
  } else if (roleData.roleId === MEMBER_ROLE_ID) {
    role = 'participant';
  }

  return {role, projectName};
}
