import {useOwnDeviceInfo, useDocumentCreatedBy} from '@comapeo/core-react';
import {useActiveProject} from '../contexts/ActiveProjectContext';

export function useIsMyDocument(originalVersionId: string) {
  const {projectId} = useActiveProject();
  const {data: deviceInfo} = useOwnDeviceInfo();
  const {data: createdByDeviceId} = useDocumentCreatedBy({
    projectId,
    originalVersionId: originalVersionId,
  });

  return createdByDeviceId === deviceInfo?.deviceId;
}
