import {Observation} from '@comapeo/schema';
import {BlobVariant} from '@comapeo/core/dist/types';
import {useMutation, useQueries, useQuery} from '@tanstack/react-query';
import {URL} from 'react-native-url-polyfill';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {ProcessedDraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import type {MapeoProjectApi} from '@comapeo/ipc';
import {ClientApi} from 'rpc-reflector';
import {AudioRecording} from '../../sharedTypes';

export function useCreateBlobMutation(opts: {retry?: number} = {}) {
  const {projectApi} = useActiveProject();

  return useMutation({
    retry: opts.retry,
    mutationFn: async (photo: ProcessedDraftPhoto) => {
      const {originalUri, previewUri, thumbnailUri} = photo;

      return projectApi.$blobs.create(
        {
          original: new URL(originalUri).pathname,
          preview: previewUri ? new URL(previewUri).pathname : undefined,
          thumbnail: thumbnailUri ? new URL(thumbnailUri).pathname : undefined,
        },
        // TODO: DraftPhoto type should probably carry MIME type info that feeds this
        // although backend currently only uses first part of path
        {
          mimeType: 'image/jpeg',
          location: photo.mediaMetadata.location,
          timestamp: photo.mediaMetadata.timestamp,
        },
      );
    },
  });
}

export function useCreateAudioBlobMutation(opts: {retry?: number} = {}) {
  const {projectApi} = useActiveProject();

  return useMutation({
    retry: opts.retry,
    mutationFn: async (audio: AudioRecording) => {
      const {uri, createdAt, duration} = audio;

      return projectApi.$blobs.create(
        {
          original: new URL(uri).pathname,
        },
        {
          mimeType: 'audio/mp4',
          timestamp: createdAt!,
          duration,
        },
      );
    },
  });
}

const resolveAttachmentUrlQueryOptions = (
  projectId: string,
  projectApi: ClientApi<MapeoProjectApi>,
  attachment: Observation['attachments'][0],
  variant: BlobVariant<
    Exclude<
      Observation['attachments'][number]['type'],
      'UNRECOGNIZED' | 'attachment_type_unspecified'
    >
  >,
  enabledByDefault: boolean = true,
) => {
  return {
    enabled: enabledByDefault,
    queryKey: [
      'attachmentUrl',
      projectId,
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
            url: await projectApi.$blobs.getUrl({
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
            url: await projectApi.$blobs.getUrl({
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
    Exclude<
      Observation['attachments'][number]['type'],
      'UNRECOGNIZED' | 'attachment_type_unspecified'
    >
  >,
  enabledByDefault: boolean = true,
) {
  const {projectId, projectApi} = useActiveProject();
  return useQuery(
    resolveAttachmentUrlQueryOptions(
      projectId,
      projectApi,
      attachment,
      variant,
      enabledByDefault,
    ),
  );
}

export function useAttachmentUrlQueries(
  attachments: Observation['attachments'],
  variant: BlobVariant<
    Exclude<
      Observation['attachments'][number]['type'],
      'UNRECOGNIZED' | 'attachment_type_unspecified'
    >
  >,
  enabledByDefault: boolean = true,
) {
  const {projectId, projectApi} = useActiveProject();

  return useQueries({
    queries: attachments.map(attachment =>
      resolveAttachmentUrlQueryOptions(
        projectId,
        projectApi,
        attachment,
        variant,
        enabledByDefault,
      ),
    ),
  });
}
