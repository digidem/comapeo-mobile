import {useIsMyDocument} from './useIsMyDocument';
import {useOwnRoleInProject} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../../sharedTypes';

export function useCanEditOrDelete(originalVersionId: string) {
  const {projectId} = useActiveProject();

  const isMine = useIsMyDocument(originalVersionId);
  const {data: roleData} = useOwnRoleInProject({projectId});
  const hasEditingRole =
    roleData?.roleId === COORDINATOR_ROLE_ID ||
    roleData?.roleId === CREATOR_ROLE_ID;

  return isMine || hasEditingRole;
}
