import {useOwnRoleInProject} from '@comapeo/core-react';
import {useProjectSettings} from './server/projects';
import {useIntl, defineMessages} from 'react-intl';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';

const m = defineMessages({
  soloProjectHeader: {
    id: 'Screens.Project.soloProjectHeader',
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

  if (!projectData?.name || !roleData?.roleId) {
    return {
      role: 'solo',
      projectHeader: formatMessage(m.soloProjectHeader),
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
    projectHeader: formatMessage(m.soloProjectHeader),
    projectName: undefined,
  };
}
