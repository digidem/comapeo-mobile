import {useOwnRoleInProject} from '@comapeo/core-react';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';
import {useActiveProject} from '../contexts/ActiveProjectContext';

type ProjectRole = 'solo' | 'coordinator' | 'participant';

export function useProjectRole(projectData?: {name?: string}): ProjectRole {
  const {projectId} = useActiveProject();
  const {data: role} = useOwnRoleInProject({projectId: projectId});
  if (!projectData?.name) return 'solo';
  if (!role?.roleId) return 'solo';

  if (role.roleId === COORDINATOR_ROLE_ID || role.roleId === CREATOR_ROLE_ID) {
    return 'coordinator';
  } else if (role.roleId === MEMBER_ROLE_ID) {
    return 'participant';
  } else {
    return 'solo';
  }
}
