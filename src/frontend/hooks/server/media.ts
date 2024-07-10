import {Observation} from '@mapeo/schema';
import {BlobId, BlobVariant} from '@mapeo/core/dist/types';
import {
  useMutation,
  useQueries,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {SetRequired} from 'type-fest';
import {URL} from 'react-native-url-polyfill';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {DraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import {MapeoProjectApi} from '@mapeo/ipc';
import {ClientApi} from 'rpc-reflector';

type SavablePhoto = SetRequired<
  Pick<DraftPhoto, 'originalUri' | 'previewUri' | 'thumbnailUri'>,
  'originalUri'
>;

export function useCreateBlobMutation(opts: {retry?: number} = {}) {
  const project = useActiveProject();

  return useMutation({
    retry: opts.retry,
    mutationFn: async (photo: SavablePhoto) => {
      const {originalUri, previewUri, thumbnailUri} = photo;

      return project.$blobs.create(
        {
          original: new URL(originalUri).pathname,
          preview: previewUri ? new URL(previewUri).pathname : undefined,
          thumbnail: thumbnailUri ? new URL(thumbnailUri).pathname : undefined,
        },
        // TODO: DraftPhoto type should probably carry MIME type info that feeds this
        // although backend currently only uses first part of path
        {mimeType: 'image/jpeg'},
      );
    },
  });
}

const resolveAttachmentUrlQueryOptions = (
  project: ClientApi<MapeoProjectApi>,
  attachment: Observation['attachments'][0],
  variant: BlobVariant<
    Exclude<Observation['attachments'][number]['type'], 'UNRECOGNIZED'>
  >,
  enabledByDefault: boolean = true,
) => {
  return {
    enabled: enabledByDefault,
    queryKey: [
      'attachmentUrl',
      attachment.driveDiscoveryId,
      attachment.type,
      variant,
      attachment.name,
    ],
    queryFn: async () => {
      switch (attachment.type) {
        case 'UNRECOGNIZED': {
          throw new Error('Cannot get URL for unrecognized attachment type');
        }
        case 'video':
        case 'audio': {
          if (variant !== 'original') {
            throw new Error('Cannot get URL of attachment for variant');
          }

          return {
            ...attachment,
            url: await project.$blobs.getUrl({
              driveId: attachment.driveDiscoveryId,
              name: attachment.name,
              type: attachment.type,
              variant,
            }),
          };
        }
        case 'photo': {
          return {
            ...attachment,
            url: await project.$blobs.getUrl({
              driveId: attachment.driveDiscoveryId,
              name: attachment.name,
              type: attachment.type,
              variant,
            }),
          };
        }
      }
    },
  };
};

export function useAttachmentUrlQuery(
  attachment: Observation['attachments'][0],
  variant: BlobVariant<
    Exclude<Observation['attachments'][number]['type'], 'UNRECOGNIZED'>
  >,
  enabledByDefault: boolean = true,
) {
  const project = useActiveProject();
  return useQuery(
    resolveAttachmentUrlQueryOptions(
      project,
      attachment,
      variant,
      enabledByDefault,
    ),
  );
}

export function useAttachmentUrlQueries(
  attachments: Observation['attachments'],
  variant: BlobVariant<
    Exclude<Observation['attachments'][number]['type'], 'UNRECOGNIZED'>
  >,
  enabledByDefault: boolean = true,
) {
  const project = useActiveProject();

  return useQueries({
    queries: attachments.map(attachment =>
      resolveAttachmentUrlQueryOptions(
        project,
        attachment,
        variant,
        enabledByDefault,
      ),
    ),
  });
}

export function useBlobUrl(blobId: BlobId) {
  const project = useActiveProject();

  return useQuery({
    queryKey: [
      'blob_url',
      blobId.driveId,
      blobId.type,
      blobId.variant,
      blobId.name,
    ],
    queryFn: () => {
      return project.$blobs.getUrl(blobId);
    },
  });
}
