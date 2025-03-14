import {PresetValue} from '@comapeo/schema';

import {useManyDocs, useCreateDocument} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {usePersistedLocale} from '../persistedState/usePersistedLocale';
export const PRESETS_KEY = 'presets';

export function useObservations() {
  const {projectId} = useActiveProject();
  return useManyDocs({
    projectId,
    docType: 'observation',
  });
}

export function usePresetsQuery() {
  const {projectId} = useActiveProject();
  const locale = usePersistedLocale(store => store.locale);
  return useManyDocs({
    projectId,
    docType: 'preset',
    lang: locale,
  });
}

export function usePresetsMutation() {
  const {projectId} = useActiveProject();

  const createDoc = useCreateDocument({
    docType: 'preset',
    projectId,
  });

  function mutatePreset(presetValue: PresetValue) {
    return createDoc.mutate({
      value: presetValue,
    });
  }

  return {
    ...createDoc,
    mutate: mutatePreset,
  };
}
