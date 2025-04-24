import * as FileSystem from 'expo-file-system';

export async function extractConfigMetadata(uri: string): Promise<{
  name: string;
  buildDate: string;
  importDate: string;
  fileVersion: string;
}> {
  const contents = await FileSystem.readAsStringAsync(uri);
  const parsed = JSON.parse(contents);

  return {
    name: parsed.name,
    buildDate: parsed.buildDate,
    importDate: new Date().toISOString(),
    fileVersion: parsed.fileVersion,
  };
}
