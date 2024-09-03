import {useMutation, useQueryClient} from '@tanstack/react-query';
import {selectFile} from '../lib/selectFile';
import * as FileSystem from 'expo-file-system';
import {PROJECT_SETTINGS_KEY, useImportProjectConfig} from './server/projects';
import {convertFileUriToPosixPath} from '../lib/file-system';

export function useSelectFileAndImportConfig() {
  const importProjectConfigMutation = useImportProjectConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const asset = await selectFile(['comapeocat']);
      if (!asset) return;

      try {
        return await importProjectConfigMutation.mutateAsync(
          convertFileUriToPosixPath(asset.uri),
        );
      } finally {
        await FileSystem.deleteAsync(asset.uri).catch((err: unknown) => {
          console.log(err);
        });
      }
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: [PROJECT_SETTINGS_KEY]});
    },
  });
}
