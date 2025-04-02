import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../useAppLanguageTag';

export function usePresetsQuery() {
  const {projectId} = useActiveProject();
  const languageTag = useAppLanguageTag();
  return useManyDocs({
    projectId,
    docType: 'preset',
    lang: languageTag,
  });
}
