import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import * as v from 'valibot';

import {useApi} from '../../contexts/ApiContext';
import {DOCUMENT_DIRECTORY, selectFile} from '../../lib/file-system';

export const MAPS_QUERY_KEY = 'maps';

const CUSTOM_MAPS_DIRECTORY = new URL('maps', DOCUMENT_DIRECTORY).href;
const DEFAULT_CUSTOM_MAP_FILE_PATH = CUSTOM_MAPS_DIRECTORY + '/default.smp';

const CustomMapInfoSchema = v.object({
  created: v.pipe(
    v.string(),
    v.isoTimestamp(),
    v.transform(input => new Date(input)),
  ),
  name: v.string(),
  size: v.pipe(v.number(), v.minValue(0)),
});

export type CustomMapInfo = v.InferOutput<typeof CustomMapInfoSchema>;

export function useMapStyleJsonUrl() {
  const api = useApi();

  return useQuery({
    queryKey: [MAPS_QUERY_KEY, 'stylejson-url'],
    queryFn: () => {
      return api.getMapStyleJsonUrl();
    },
  });
}

export function useSelectCustomMapFile() {
  return useMutation({
    mutationFn: () => {
      return selectFile({
        extensionFilters: ['smp'],
      });
    },
  });
}

export function useImportCustomMapFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (opts: {uri: string}) => {
      return FileSystem.moveAsync({
        from: opts.uri,
        to: DEFAULT_CUSTOM_MAP_FILE_PATH,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MAPS_QUERY_KEY],
      });
    },
  });
}

export function useRemoveCustomMapFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return FileSystem.deleteAsync(DEFAULT_CUSTOM_MAP_FILE_PATH, {
        idempotent: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MAPS_QUERY_KEY],
      });
    },
  });
}

/**
 * Returns `null` if no viable map is found. Throws an error if a detected map is invalid.
 */
export function useGetCustomMapInfo() {
  const api = useApi();

  return useQuery({
    queryKey: [MAPS_QUERY_KEY, 'custom', 'info'],
    queryFn: async () => {
      const styleUrl = await api.getMapStyleJsonUrl();

      const infoUrl = new URL('/maps/custom/info', styleUrl).href;

      const response = await fetch(infoUrl);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Cannot get custom map info: ${response.statusText}`);
      }

      return v.parse(CustomMapInfoSchema, await response.json());
    },
  });
}
