import {
  useManyDocs,
  useSingleDocByDocId,
  useUpdateDocument,
  useDeleteDocument,
  usePresetsSelection,
} from '@comapeo/core-react';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../useAppLanguageTag';
import {usePresetsQuery} from './presets';

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

export function useTrackPresets() {
  const {projectId} = useActiveProject();
  const lang = useAppLanguageTag();
  const tracks = usePresetsSelection({
    projectId: projectId,
    dataType: 'track',
    lang,
  });
  return tracks.filter(p => p.geometry.includes('line'));
}

export function useGetPresetById(presetRefId: string | undefined) {
  const {data: allPresets} = usePresetsQuery();

  if (!presetRefId || !allPresets) return null;

  return allPresets.find(p => p.docId === presetRefId) ?? null;
}
