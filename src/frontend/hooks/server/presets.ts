import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {usePersistedLocale} from '../persistedState/usePersistedLocale';

export function usePresetsQuery() {
  const {projectId} = useActiveProject();
  const locale = usePersistedLocale(store => store.locale);
  return useManyDocs({
    projectId,
    docType: 'preset',
    lang: locale,
  });
}
