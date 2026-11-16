import {useManyMembers} from '@comapeo/core-react';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';

const COORDINATOR_ROLES = new Set([COORDINATOR_ROLE_ID, CREATOR_ROLE_ID]);

export function useIsLastMember({deviceId}: {deviceId: string}) {
  const {projectId} = useActiveProject();
  const membersQuery = useManyMembers({projectId});

  const membersOnProject = membersQuery.data.filter(
    member =>
      COORDINATOR_ROLES.has(member.role.roleId) ||
      member.role.roleId === MEMBER_ROLE_ID,
  );

  return (
    membersOnProject.length === 1 &&
    membersOnProject.some(member => member.deviceId === deviceId)
  );
}
