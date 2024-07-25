import {Observation} from '@mapeo/schema';
import {BlobVariant} from '@mapeo/core/dist/types';
import {useMutation, useQueries, useQuery} from '@tanstack/react-query';
import {URL} from 'react-native-url-polyfill';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {ProcessedDraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import {MapeoProjectApi} from '@mapeo/ipc';
import {ClientApi} from 'rpc-reflector';

export function useCreateBlobMutation(opts: {retry?: number} = {}) {
  const project = useActiveProject();

  return useMutation({
    retry: opts.retry,
    mutationFn: async (photo: ProcessedDraftPhoto) => {
      const {originalUri, previewUri, thumbnailUri} = photo;

      return project.$blobs.create(
        {
          original: new URL(originalUri).pathname,
          preview: previewUri ? new URL(previewUri).pathname : undefined,
          thumbnail: thumbnailUri ? new URL(thumbnailUri).pathname : undefined,
        },
        // TODO: DraftPhoto type should probably carry MIME type info that feeds this
        // although backend currently only uses first part of path
        {
          mimeType: 'image/jpeg',
          // @ts-expect-error
          location: photo.mediaMetadata.location,
          timestamp: photo.mediaMetadata.timestamp,
        },
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
