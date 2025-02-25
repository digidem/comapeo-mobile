import {useQuery} from '@tanstack/react-query';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useResolvedLanguageTag} from '../useResolvedLanguageTag';

export const FIELDS_KEY = 'fields';

export const useFieldsQuery = () => {
  const {projectId, projectApi} = useActiveProject();
  const lang = useResolvedLanguageTag();

  return useQuery({
    queryKey: [FIELDS_KEY, projectId, lang],
    queryFn: async () => {
      return projectApi.field.getMany({lang});
    },
  });
};
