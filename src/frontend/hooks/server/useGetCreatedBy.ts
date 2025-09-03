import {useDocumentCreatedBy, useSingleMember} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const useGetCreatedBy = (originalVersionId: string) => {
  const {projectId} = useActiveProject();
  const {data: deviceId} = useDocumentCreatedBy({projectId, originalVersionId});
  return useSingleMember({deviceId, projectId});
};
