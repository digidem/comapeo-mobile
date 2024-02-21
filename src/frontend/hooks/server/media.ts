import {Observation} from '@mapeo/schema';
import {BlobVariant} from '@mapeo/core/dist/types';
import {useMutation, useQueries} from '@tanstack/react-query';
import {SetRequired} from 'type-fest';
import {URL} from 'react-native-url-polyfill';

import {DraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import {useProject} from './projects';

type SavablePhoto = SetRequired<
  Pick<DraftPhoto, 'originalUri' | 'previewUri' | 'thumbnailUri'>,
  'originalUri'
>;

export function useCreateAttachmentsMutation() {
  const project = useProject();

  return useMutation({
    mutationFn: async (photos: SavablePhoto[]) => {
      if (!project) throw new Error('Project instance does not exist');

      return Promise.all(
        photos.map(p => {
          const {originalUri, previewUri, thumbnailUri} = p;

          return project.$blobs.create(
            {
              original: new URL(originalUri).pathname,
              preview: previewUri ? new URL(previewUri).pathname : undefined,
              thumbnail: thumbnailUri
                ? new URL(thumbnailUri).pathname
                : undefined,
            },
            // TODO: DraftPhoto type should probably carry MIME type info that feeds this
            // although backend currently only uses first part of path
            {mimeType: 'image/jpeg'},
          );
        }),
      );
    },
  });
}

export function useAttachmentUrlQueries(
  attachments: Observation['attachments'],
  variant: BlobVariant<
    Exclude<Observation['attachments'][number]['type'], 'UNRECOGNIZED'>
  >,
) {
  const project = useProject();

  return useQueries({
    queries: attachments.map(attachment => {
      return {
        queryKey: [
          'attachmentUrl',
          attachment.driveDiscoveryId,
          attachment.type,
          variant,
          attachment.name,
        ],
        queryFn: async () => {
          if (!project) throw new Error('Project instance does not exist');

          switch (attachment.type) {
            case 'UNRECOGNIZED': {
              throw new Error(
                'Cannot get URL for unrecognized attachment type',
              );
            }
            case 'video':
            case 'audio': {
              if (variant !== 'original') {
                throw new Error('Cannot get URL of attachment for variant');
              }

              return project.$blobs.getUrl({
                driveId: attachment.driveDiscoveryId,
                name: attachment.name,
                type: attachment.type,
                variant,
              });
            }
            case 'photo': {
              return project.$blobs.getUrl({
                driveId: attachment.driveDiscoveryId,
                name: attachment.name,
                type: attachment.type,
                variant,
              });
            }
          }
        },
      };
    }),
  });
}
