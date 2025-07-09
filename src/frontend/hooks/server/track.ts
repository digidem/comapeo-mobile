import {
  useManyDocs,
  useSingleDocByDocId,
  useUpdateDocument,
  useDeleteDocument,
} from '@comapeo/core-react';

import {useActiveProject} from '../../contexts/ActiveProjectContext';

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

export function useGetPresetById(presetRefId: string | undefined) {
  const {projectId} = useActiveProject();
  const {data: allPresets} = useManyDocs({projectId, docType: 'preset'});

  if (!presetRefId || !allPresets) return null;

  return allPresets.find(p => p.docId === presetRefId) ?? null;
}
