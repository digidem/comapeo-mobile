import {useOwnRoleInProject, useProjectSettings} from '@comapeo/core-react';
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

/**
 * Represents the role of a user within a project, as used in the frontend.
 * - 'coordinator': Backend role indicating the user manages the project.
 * - 'participant': Backend role indicating the user contributes to the project.
 * - 'solo': Derived frontend-only role indicating the user is the sole owner/manager.
 */
export type FrontendRole = 'coordinator' | 'participant' | 'solo';

export type ProjectDetails = {
  projectColor: string;
  projectDescription?: string;
} & (
  | {
      role: Extract<FrontendRole, 'solo'>;
      projectHeader: string;
      projectName: undefined;
    }
  | {
      role: Exclude<FrontendRole, 'solo'>;
      projectName: string;
      projectDescription?: string;
    }
);

export function useProjectRoleAndDetails(projectId: string): ProjectDetails {
  const {data: projectData} = useProjectSettings({projectId});
  const {data: roleData} = useOwnRoleInProject({projectId});
  const {formatMessage} = useIntl();

  const soloProject: ProjectDetails = {
    role: 'solo',
    projectHeader: formatMessage(m.mySoloProject),
    projectName: undefined,
    projectColor: '#E5F0FF',
  };

  if (!projectData?.name || !roleData?.roleId) {
    return soloProject;
  }

  const {roleId} = roleData;
  if (roleId === COORDINATOR_ROLE_ID || roleId === CREATOR_ROLE_ID) {
    return {
      role: 'coordinator',
      projectName: projectData.name,
      projectColor: projectData.projectColor || '#FFF5EB',
      projectDescription: projectData.projectDescription,
    };
  } else if (roleId === MEMBER_ROLE_ID) {
    return {
      role: 'participant',
      projectName: projectData.name,
      projectColor: projectData.projectColor || '#FFF5EB',
      projectDescription: projectData.projectDescription,
    };
  }

  return soloProject as ProjectDetails;
}
