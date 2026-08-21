import type {MemberApi} from '@comapeo/core';
import {
  useProjectSettings as useComapeoProjectSettings,
  useExportGeoJSON,
  useExportZipFile,
  useManyMembers,
  useOwnRoleInProject,
} from '@comapeo/core-react';
import {useMutation, useQuery} from '@tanstack/react-query';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {MEMBER_ROLE_ID} from '../../sharedTypes';
import {saveDocuments} from '@react-native-documents/picker';
import {Exports} from '../../sharedTypes/navigation';
import * as FileSystem from 'expo-file-system/legacy';
import {useLocaleState} from '../../contexts/LocaleStoreContext';
import {useIntl} from 'react-intl';
import noop from '../../lib/noop';

export function isUserCancelled(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    (err as {message?: string}).message === 'user canceled the document picker'
  );
}

export function useProjectSettings() {
  const {projectId} = useActiveProject();
  return useComapeoProjectSettings({projectId});
}

export function useGetOwnRole() {
  const {projectId} = useActiveProject();
  return useOwnRoleInProject({projectId});
}

// TODO: Ideally this is handled in @comapeo/core (https://github.com/digidem/comapeo-core/issues/1031)
export type ArchiveServerMemberInfo = MemberApi.MemberInfo & {
  deviceType: 'selfHostedServer';
  selfHostedServerDetails: NonNullable<
    MemberApi.MemberInfo['selfHostedServerDetails']
  >;
};

// TODO: Ideally this is handled in @comapeo/core (https://github.com/digidem/comapeo-core/issues/1031)
export function isActiveArchiveServerMember(
  member: MemberApi.MemberInfo,
): member is ArchiveServerMemberInfo & MemberApi.ActiveMemberInfo {
  if (member.deviceType !== 'selfHostedServer') return false;
  if (!member.selfHostedServerDetails) return false;
  if (member.role.roleId !== MEMBER_ROLE_ID) return false;
  return true;
}

export function useActiveArchiveServer({projectId}: {projectId: string}) {
  const {data: members} = useManyMembers({projectId, includeLeft: false});
  return members.find(isActiveArchiveServerMember);
}

export function useFindRemoteArchive({url}: {url?: string}) {
  return useQuery({
    queryFn: async () => {
      if (!url) throw new Error('no url');
      const response = await fetch(url);

      if (response.status !== 200) {
        throw new Error('Server should return a 200');
      }

      const responseJson = await response.json();

      if (
        responseJson &&
        typeof responseJson === 'object' &&
        'data' in responseJson &&
        responseJson.data &&
        typeof responseJson.data === 'object' &&
        'name' in responseJson.data &&
        responseJson.data.name &&
        typeof responseJson.data.name === 'string'
      ) {
        return responseJson.data.name;
      } else {
        throw new Error('Server responded with unexpected data');
      }
    },
    queryKey: [url],
    enabled: !!url,
  });
}

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const EXPORT_MUTATION_KEY = ['background', 'export', 'observations'] as const;

export class ExportFileMissingError extends Error {
  name = 'ExportFileMissingError';
}

/**
 * Copy the exported file to the user-chosen destination via the SAF dialog. If
 * the source file is gone by the time the copy runs (the SAF dialog can stay
 * open for a while), the native layer throws an ENOENT FileNotFoundException —
 * surface a clear domain error rather than the opaque native one. (We check the
 * error from the operation rather than pre-checking existence, which would be a
 * TOCTOU race.)
 */
async function saveExportDocument(
  args: Parameters<typeof saveDocuments>[0],
  filepath: string,
) {
  try {
    return await saveDocuments(args);
  } catch (err) {
    if (err instanceof Error && err.message.includes('ENOENT')) {
      throw new ExportFileMissingError(`Export file is missing: ${filepath}`);
    }
    throw err;
  }
}

export function useExportObservations({projectId}: {projectId: string}) {
  const exportNoMedia = useExportGeoJSON({projectId});
  const exportWithMedia = useExportZipFile({projectId});
  const lang = useLocaleState(s => s.languageTag);
  const {formatDate} = useIntl();

  return useMutation({
    mutationKey: EXPORT_MUTATION_KEY,
    retry: false,
    networkMode: 'always',
    mutationFn: async ({exportType}: {exportType: Exports}) => {
      // Use the persistent document directory, not the volatile cache: the
      // export file must survive while the SAF "Save As" dialog is open, or
      // Android cache eviction can delete it before the copy runs.
      const exportDir = FileSystem.documentDirectory + 'exports/';
      const exportDirectory = await FileSystem.getInfoAsync(exportDir);

      if (!exportDirectory.exists) {
        await FileSystem.makeDirectoryAsync(exportDir);
      }

      const filePrefix =
        exportType === 'Tracks' ? 'CoMapeo_Tracks' : 'CoMapeo_Obsvns';
      const fileName = `${filePrefix}_${formatDate(Date.now())}`;

      if (exportType === 'Observation' || exportType === 'Tracks') {
        return exportNoMedia
          .mutateAsync({
            path: normalizeFilePath(exportDir),
            exportOptions: {
              lang,
              observations: exportType === 'Observation',
              tracks: exportType === 'Tracks',
            },
          })
          .then(async path => {
            const filepath = `file://${path}`;
            try {
              return await saveExportDocument(
                {
                  sourceUris: [filepath],
                  mimeType: 'application/geo+json',
                  fileName: `${fileName}.geojson`,
                },
                filepath,
              );
            } finally {
              // documentDirectory is not auto-reclaimed by the OS, so always
              // remove the export source — even if the SAF copy was cancelled
              // or failed — so exports don't accumulate on the device.
              FileSystem.deleteAsync(filepath, {idempotent: true}).catch(noop);
            }
          });
      }

      return await exportWithMedia
        .mutateAsync({
          path: normalizeFilePath(exportDir),
          exportOptions: {
            lang,
            observations: true,
            tracks: false,
            attachments: true,
          },
        })
        .then(async path => {
          const filepath = `file://${path}`;
          try {
            return await saveExportDocument(
              {
                sourceUris: [filepath],
                mimeType: 'application/zip',
                fileName: `${fileName}.zip`,
              },
              filepath,
            );
          } finally {
            // documentDirectory is not auto-reclaimed by the OS, so always
            // remove the export source — even if the SAF copy was cancelled or
            // failed — so exports don't accumulate on the device.
            FileSystem.deleteAsync(filepath, {idempotent: true}).catch(noop);
          }
        });
    },
  });
}

const normalizeFilePath = (uri: string) => {
  return uri.replace(/^file:\/\//, '');
};
