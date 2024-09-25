import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

// TODO: What to do when `FileSystem.documentDirectory` is null?
export const CUSTOM_STYLED_MAPS_DIRECTORY =
  FileSystem.documentDirectory + 'styled-maps/';

export const CUSTOM_MAPS_QUERY_KEY = 'custom-maps';

export function useSelectOfflineMapFile() {
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
      if (!FileSystem.documentDirectory) {
        throw new Error('Document directory is unknown');
      }

      const fileName = opts.uri.split('/').at(-1);

      const directoryFileInfo = await FileSystem.getInfoAsync(
        CUSTOM_STYLED_MAPS_DIRECTORY,
      );

      if (!directoryFileInfo.exists) {
        await FileSystem.makeDirectoryAsync(CUSTOM_STYLED_MAPS_DIRECTORY);
      }

      return FileSystem.moveAsync({
        from: opts.uri,
        to: CUSTOM_STYLED_MAPS_DIRECTORY + fileName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CUSTOM_MAPS_QUERY_KEY],
      });
    },
  });
}

export function useRemoveCustomMapFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opts: {uri: string}) => {
      return FileSystem.deleteAsync(opts.uri, {
        idempotent: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CUSTOM_MAPS_QUERY_KEY],
      });
    },
  });
}

/**
 * Returns `null` if no viable map is found. Throws an error if a detected map is invalid.
 */
export function useGetCustomMapDetails() {
  return useQuery({
    queryKey: [CUSTOM_MAPS_QUERY_KEY, 'active'],
    queryFn: async () => {
      const files = await FileSystem.readDirectoryAsync(
        CUSTOM_STYLED_MAPS_DIRECTORY,
      );

      const activeUri = files[0];

      if (!activeUri) {
        return null;
      }

      const mapFileInfo = await FileSystem.getInfoAsync(
        CUSTOM_STYLED_MAPS_DIRECTORY + activeUri,
      );

      if (!mapFileInfo.exists || mapFileInfo.isDirectory) {
        return null;
      }

      const mapName = mapFileInfo.uri.split('/').at(-1);

      if (!mapName) {
        throw new Error('Unable to derive map name');
      }

      return {
        size: mapFileInfo.size,
        uri: mapFileInfo.uri,
        // TODO: Cannot seem to rely on this being accurate. May need to keep an adjacent timestamp file
        modificationTime: mapFileInfo.modificationTime,
        name: mapName,
      };
    },
  });
}

async function selectFile(opts: {
  copyToCache?: boolean;
  mimeFilters?: Array<string>;
  extensionFilters?: Array<string>;
}) {
  const documentResult = await DocumentPicker.getDocumentAsync({
    type: opts.mimeFilters,
    copyToCacheDirectory: opts.copyToCache,
    multiple: false,
  });

  if (documentResult.canceled) return null;

  const asset = documentResult.assets[0];

  if (!asset) {
    throw new Error();
  }

  const hasValidExtension = opts.extensionFilters
    ? opts.extensionFilters.some(extension =>
        asset.uri.endsWith(`.${extension}`),
      )
    : true;

  if (!hasValidExtension) {
    FileSystem.deleteAsync(asset.uri).catch(err => {
      console.log(err);
    });
    throw new Error('Invalid extension');
  }

  return asset;
}
