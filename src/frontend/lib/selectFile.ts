import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export async function selectFile(validFileTypes: string[]) {
  let result;
  try {
    result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
  } catch (err) {
    throw err;
  }

  if (result.canceled) return;

  const asset = result.assets[0];

  // Shouldn't happen based on how the library works
  if (!asset) {
    return;
  }

  const isValidFileType = validFileTypes.some(type =>
    asset.name.endsWith(type),
  );

  // Only allow importing files with the desired extension
  if (isValidFileType) {
    return asset;
  } else {
    FileSystem.deleteAsync(asset.uri);
    throw new Error('Invalid file type');
  }
}
