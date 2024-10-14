import {useQuery} from '@tanstack/react-query';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {usePersistedLocale} from '../persistedState/usePersistedLocale';

export const FIELDS_KEY = 'fields';

export const useFieldsQuery = () => {
  const {projectId, projectApi} = useActiveProject();
  const lang = usePersistedLocale(store => store.locale);

  return useQuery({
    queryKey: [FIELDS_KEY, projectId, lang],
    queryFn: async () => {
      return projectApi.field.getMany({lang});
    },
  });
};
