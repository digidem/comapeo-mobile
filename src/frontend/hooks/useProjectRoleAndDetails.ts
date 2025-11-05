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
 * - 'removed': Derived frontend-only role indicating the user has been removed from the project.
 */
export type FrontendRole = 'coordinator' | 'participant' | 'solo' | 'removed';

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

  const soloProject: ProjectDetails = {
    role: 'solo',
    projectHeader: deviceName || '',
    projectName: undefined,
    projectColor: '#E5F0FF',
  };

  if (!roleData?.roleId) return soloProject;

  const {roleId} = roleData;

  switch (roleId) {
    case BLOCKED_ROLE_ID:
      return {
        role: 'removed',
        projectHeader: '',
        projectName: undefined,
        projectColor: '#E5F0FF',
      };

    case COORDINATOR_ROLE_ID:
    case CREATOR_ROLE_ID:
      if (!projectData?.name) return soloProject;
      return {
        role: 'coordinator',
        projectHeader: `${projectData.name} - ${formatMessage(m.coordinator)}`,
        projectName: projectData.name,
        projectColor: projectData.projectColor || '#FFF5EB',
        projectDescription: projectData.projectDescription,
      };

    case MEMBER_ROLE_ID:
      if (!projectData?.name) return soloProject;
      return {
        role: 'participant',
        projectHeader: `${projectData.name} - ${formatMessage(m.participant)}`,
        projectName: projectData.name,
        projectColor: projectData.projectColor || '#FFF5EB',
        projectDescription: projectData.projectDescription,
      };

    default:
      return soloProject;
  }
}
