import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

// @ts-expect-error Only null when on web https://github.com/expo/expo/issues/5558
export const DOCUMENT_DIRECTORY: string = FileSystem.documentDirectory;

export function convertFileUriToPosixPath(fileUri: string) {
  return fileUri.replace(/^file:\/\//, '');
}

// TODO: Some overlap with selectFile() from lib/utils but fixes some usage limitations. Ideally use this for everything
export async function selectFile(opts: {
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
