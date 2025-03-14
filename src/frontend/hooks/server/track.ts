import {
  useManyDocs,
  useSingleDocByDocId,
  useUpdateDocument,
  useDeleteDocument,
} from '@comapeo/core-react';

import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const TRACK_KEY = 'tracks';

export function useTracks() {
  const {projectId} = useActiveProject();
  return useManyDocs({
    projectId,
    docType: 'track',
  });
}

export function useTrackQuery(docId: string) {
  const {projectId} = useActiveProject();
  return useSingleDocByDocId({
    projectId,
    docType: 'track',
    docId,
  });
}

export function useEditTrackMutation() {
  const {projectId} = useActiveProject();
  return useUpdateDocument({
    projectId,
    docType: 'track',
  });
}

export function useDeleteTrackMutation() {
  const {projectId} = useActiveProject();
  return useDeleteDocument({
    projectId,
    docType: 'track',
  });
}
