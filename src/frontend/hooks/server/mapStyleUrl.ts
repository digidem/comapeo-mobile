import {useQuery} from '@tanstack/react-query';

import {useApi} from '../../contexts/ApiContext';

export const MAP_STYLE_URL_KEY = 'map_style_url';

export function useMapStyleUrl() {
  const api = useApi();

  return useQuery({
    queryKey: [MAP_STYLE_URL_KEY],
    queryFn: () => {
      return api.getMapStyleJsonUrl();
    },
  });
}
