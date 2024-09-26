import {
  ExternalDirectoryPath,
  unlink as rnUnlink,
} from '@dr.pogodin/react-native-fs';

export function convertFileUriToPosixPath(fileUri: string) {
  return fileUri.replace(/^file:\/\//, '');
}

export async function unlink(fileUri: string): Promise<void> {
  const posixPath = convertFileUriToPosixPath(fileUri);
  return rnUnlink(posixPath);
}

export {ExternalDirectoryPath as EXTERNAL_FILES_DIR};
