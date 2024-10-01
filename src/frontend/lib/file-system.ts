import {ExternalDirectoryPath} from '@dr.pogodin/react-native-fs';

export function convertFileUriToPosixPath(fileUri: string) {
  return fileUri.replace(/^file:\/\//, '');
}

export {ExternalDirectoryPath as EXTERNAL_FILES_DIR};
