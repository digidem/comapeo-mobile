import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

// @ts-expect-error Only null when on web https://github.com/expo/expo/issues/5558
export const DOCUMENT_DIRECTORY: string = FileSystem.documentDirectory;

export function convertFileUriToPosixPath(fileUri: string) {
  return fileUri.replace(/^file:\/\//, '');
}

/**
 * Select a single file from the device file system.
 *
 * @param opts.copyToCacheDirectory Copy the selected file to the cache directory for immediate usage. Note that if this is set to `true`, the file can be immediately used and the resulting URI for selected file will be prefixed with `file://` instead of `content://`.
 * @param opts.extensionFilters File extensions to allow. Leaving this unspecified allows any kind of file to be selected.
 * @param opts.mimeFilters MIME types to allow. Leaving this unspecified allows any kind of MIME type to be considered.
 *
 * @returns The selected file. If `null` it means the selection was cancelled.
 */
export async function selectFile({
  copyToCacheDirectory,
  extensionFilters,
  mimeFilters,
}: {
  copyToCacheDirectory: boolean;
  extensionFilters?: Array<string>;
  mimeFilters?: Array<string>;
}) {
  const documentResult = await DocumentPicker.getDocumentAsync({
    type: mimeFilters,
    copyToCacheDirectory,
    multiple: false,
  });

  if (documentResult.canceled) return null;

  const asset = documentResult.assets[0];

  // Shouldn't happen but just in case
  if (!asset) {
    throw new Error('Expected document to be selected');
  }

  if (extensionFilters) {
    const hasValidExtension = extensionFilters.some(extension => {
      return asset.name.toLowerCase().endsWith(`.${extension.toLowerCase()}`);
    });

    if (!hasValidExtension) {
      throw new Error('Invalid extension');
    }
  }

  return asset;
}
