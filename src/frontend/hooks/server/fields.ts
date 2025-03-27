import {useQuery} from '@tanstack/react-query';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../useAppLanguageTag';

export const FIELDS_KEY = 'fields';

export const useFieldsQuery = () => {
  const {projectId, projectApi} = useActiveProject();
  const languageTag = useAppLanguageTag();

  return useQuery({
    queryKey: [FIELDS_KEY, projectId, languageTag],
    queryFn: async () => {
      return projectApi.field.getMany({lang: languageTag});
    },
  });
};
