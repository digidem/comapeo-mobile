import {useQuery} from '@tanstack/react-query';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../useAppLanguageTag';

export const FIELDS_KEY = 'fields';

export const useFieldsQuery = () => {
  const {projectId, projectApi} = useActiveProject();
  const {value} = useAppLanguageTag();

  return useQuery({
    queryKey: [FIELDS_KEY, projectId, value],
    queryFn: async () => {
      return projectApi.field.getMany({lang: value});
    },
  });
};
