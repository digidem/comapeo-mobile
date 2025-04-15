import {useOwnRoleInProject} from '@comapeo/core-react';
import {useProjectSettings} from './server/projects';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';

export type ProjectDetails =
  | {
      role: 'solo';
      projectHeader: 'My Solo Project';
      projectName: undefined;
    }
  | {
      role: 'coordinator' | 'participant';
      projectName: string;
    };

export function useProjectRoleAndDetails(projectId: string): ProjectDetails {
  const {data: projectData} = useProjectSettings();
  const {data: roleData} = useOwnRoleInProject({projectId});

  if (!projectData?.name || !roleData?.roleId) {
    return {
      role: 'solo',
      projectHeader: 'My Solo Project',
      projectName: undefined,
    };
  }

  const {roleId} = roleData;
  if (roleId === COORDINATOR_ROLE_ID || roleId === CREATOR_ROLE_ID) {
    return {
      role: 'coordinator',
      projectName: projectData.name,
    };
  } else if (roleId === MEMBER_ROLE_ID) {
    return {
      role: 'participant',
      projectName: projectData.name,
    };
  }

  return {
    role: 'solo',
    projectHeader: 'My Solo Project',
    projectName: undefined,
  };
}
