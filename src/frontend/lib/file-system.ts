export function convertFileUriToPosixPath(fileUri: string) {
  return fileUri.replace(/^file:\/\//, '');
}
