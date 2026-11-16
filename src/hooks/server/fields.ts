import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useLocaleState} from '../../contexts/LocaleStoreContext';

export function useFieldsQuery() {
  const {projectId} = useActiveProject();
  const languageTag = useLocaleState(s => s.languageTag);
  return useManyDocs({
    projectId,
    docType: 'field',
    lang: languageTag,
  });
}
