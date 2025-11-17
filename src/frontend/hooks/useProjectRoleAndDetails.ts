import {
  useOwnDeviceInfo,
  useOwnRoleInProject,
  useProjectSettings,
} from '@comapeo/core-react';
import {
  BLOCKED_ROLE_ID,
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {DEFAULT_PROJECT_COLOR} from '../constants';

const m = defineMessages({
  coordinator: {
    id: 'useProjectRoleAndDetails.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: 'useProjectRoleAndDetails.participant',
    defaultMessage: 'Participant',
  },
});

/**
 * Represents the role of a user within a project, as used in the frontend.
 * - 'coordinator': Backend role indicating the user manages the project.
 * - 'participant': Backend role indicating the user contributes to the project.
 * - 'solo': Derived frontend-only role indicating the user is the sole owner/manager.
 */
export type FrontendRole =
  | 'coordinator'
  | 'participant'
  | 'solo'
  | 'blocked'
  | undefined;

export type ProjectDetails = {
  role: FrontendRole;
  projectHeader: string;
  projectName: string | undefined;
  projectColor: string;
  projectDescription?: string;
};

export function useProjectRoleAndDetails(projectId: string): ProjectDetails {
  const {formatMessage} = useIntl();
  const {data: projectData} = useProjectSettings({projectId});
  const {
    data: {name: deviceName},
  } = useOwnDeviceInfo();
  const {data: roleData} = useOwnRoleInProject({projectId});

  if (!projectData?.name) {
    return {
      role: 'solo',
      projectHeader: deviceName || '',
      projectName: undefined,
      projectColor: '#E5F0FF',
    };
  }
  const {roleId} = roleData;

  if (roleId === COORDINATOR_ROLE_ID || roleId === CREATOR_ROLE_ID) {
    return {
      role: 'coordinator',
      projectHeader: `${projectData.name} - ${formatMessage(m.coordinator)}`,
      projectName: projectData.name,
      projectColor: projectData.projectColor || DEFAULT_PROJECT_COLOR,
      projectDescription: projectData.projectDescription,
    };
  }

  if (roleId === MEMBER_ROLE_ID) {
    return {
      role: 'participant',
      projectHeader: `${projectData.name} - ${formatMessage(m.participant)}`,
      projectName: projectData.name,
      projectColor: projectData.projectColor || DEFAULT_PROJECT_COLOR,
      projectDescription: projectData.projectDescription,
    };
  }

  return {
    role: roleId === BLOCKED_ROLE_ID ? 'blocked' : undefined,
    projectHeader: projectData.name,
    projectName: projectData.name,
    projectColor: projectData.projectColor || DEFAULT_PROJECT_COLOR,
    projectDescription: projectData.projectDescription,
  };
}
