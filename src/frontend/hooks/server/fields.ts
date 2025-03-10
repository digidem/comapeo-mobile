import {useQuery} from '@tanstack/react-query';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useLanguageTag} from '../resolvedSettings/useLanguageTag';

export const FIELDS_KEY = 'fields';

export const useFieldsQuery = () => {
  const {projectId, projectApi} = useActiveProject();
  const lang = useLanguageTag().value;

  return useQuery({
    queryKey: [FIELDS_KEY, projectId, lang],
    queryFn: async () => {
      return projectApi.field.getMany({lang});
    },
  });
};
