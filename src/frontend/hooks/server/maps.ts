import {useClientApi, useMapStyleUrl} from '@comapeo/core-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import * as v from 'valibot';

import {DOCUMENT_DIRECTORY} from '../../lib/file-system';

import {createRefreshTokenStore} from '../refreshTokenStore';
import noop from '../../lib/noop';
import {ROOT_QUERY_KEY} from '../../constants';

/**
 * Copied from comapeo/core-react to match its query key structure:
 * https://github.com/digidem/comapeo-core-react/blob/59a80cf0a1b9dad13e5f066233dae2465d2d20b1/src/lib/react-query/maps.ts#L6
 * Ensures partial invalidations align with the library’s queries.
 */
function getMapsQueryKey() {
  return [ROOT_QUERY_KEY, 'maps'] as const;
}

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

const {useRefreshToken, useRefreshTokenActions} = createRefreshTokenStore();

export function useMapStyleJsonUrl() {
  const refreshToken = useRefreshToken();

  const {
    data: baseUrl,
    error,
    isRefetching,
  } = useMapStyleUrl({
    refreshToken: refreshToken?.toString(),
  });

  // If we're running E2E tests (e.g. on BrowserStack), fall back to a
  // public Mapbox style rather than our local style server to avoid 502 errors.
  // (see https://github.com/digidem/comapeo-mobile/issues/1008)
  if (process.env.EXPO_PUBLIC_E2E_TEST) {
    return {
      data: 'mapbox://styles/mapbox/streets-v11',
      error: null,
      isRefetching: false,
    };
  }

  return {
    data: baseUrl,
    error,
    isRefetching,
  };
}

export function useImportCustomMapFile() {
  const queryClient = useQueryClient();
  const api = useClientApi();
  const {refresh} = useRefreshTokenActions();

  return useMutation({
    mutationFn: async (opts: {uri: string}) => {
      await FileSystem.copyAsync({
        from: opts.uri,
        to: DEFAULT_CUSTOM_MAP_FILE_PATH,
      });

      const styleUrl = await api.getMapStyleJsonUrl();

      const response = await fetchCustomMapInfo(styleUrl);

      if (!response.ok) {
        FileSystem.deleteAsync(DEFAULT_CUSTOM_MAP_FILE_PATH, {
          idempotent: true,
        }).catch(noop);

        throw new Error('Invalid map file');
      }
    },
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({
        queryKey: getMapsQueryKey(),
      });
    },
  });
}

export function useRemoveCustomMapFile() {
  const queryClient = useQueryClient();
  const {refresh} = useRefreshTokenActions();

  return useMutation({
    mutationFn: () => {
      return FileSystem.deleteAsync(DEFAULT_CUSTOM_MAP_FILE_PATH, {
        idempotent: true,
      });
    },
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({
        queryKey: getMapsQueryKey(),
      });
    },
  });
}

/**
 * Returns `null` if no viable map is found. Throws an error if a detected map is invalid.
 */
export function useGetCustomMapInfo() {
  const {data: styleUrl} = useMapStyleJsonUrl();

  return useQuery({
    queryKey: [...getMapsQueryKey(), 'custom', 'info', {styleUrl}],
    queryFn: async () => {
      const response = await fetchCustomMapInfo(styleUrl);

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

async function fetchCustomMapInfo(baseUrl: string) {
  const infoUrl = new URL('/maps/custom/info', baseUrl).href;
  return fetch(infoUrl);
}
