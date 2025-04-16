import {useOwnRoleInProject} from '@comapeo/core-react';
import {useProjectSettings} from './server/projects';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  mySoloProject: {
    id: 'useProjectRoleAndDetails.mySoloProject',
    defaultMessage: 'My Solo Project',
  },
});

export type ProjectDetails =
  | {
      role: 'solo';
      projectHeader: string;
      projectName: undefined;
    }
  | {
      role: 'coordinator' | 'participant';
      projectName: string;
    };

export function useProjectRoleAndDetails(projectId: string): ProjectDetails {
  const {data: projectData} = useProjectSettings();
  const {data: roleData} = useOwnRoleInProject({projectId});
  const {formatMessage} = useIntl();

  const soloProject = {
    role: 'solo',
    projectHeader: formatMessage(m.mySoloProject),
    projectName: undefined,
  };

  if (!projectData?.name || !roleData?.roleId) {
    return soloProject as ProjectDetails;
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

  return soloProject as ProjectDetails;
}
