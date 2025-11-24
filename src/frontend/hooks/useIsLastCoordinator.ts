import {useManyMembers} from '@comapeo/core-react';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../sharedTypes';

const COORDINATOR_ROLES = new Set([COORDINATOR_ROLE_ID, CREATOR_ROLE_ID]);

export function useIsLastCoordinator({deviceId}: {deviceId: string}) {
  const {projectId} = useActiveProject();
  const membersQuery = useManyMembers({projectId});

  const coordinators = membersQuery.data.filter(member =>
    COORDINATOR_ROLES.has(member.role.roleId),
  );

  return (
    coordinators.length === 1 &&
    coordinators.some(coordinator => coordinator.deviceId === deviceId)
  );
}
