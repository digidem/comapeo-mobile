import {Observation} from '@comapeo/schema';
import {BlobVariant, BlobId} from '@comapeo/core/dist/types';
import {useQueries} from '@tanstack/react-query';
import {URL} from 'react-native-url-polyfill';
import {useCreateBlob, useAttachmentUrl} from '@comapeo/core-react';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {ProcessedDraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import type {MapeoProjectApi} from '@comapeo/ipc';
import {ClientApi} from 'rpc-reflector';
import {UnsavedAudio} from '../../sharedTypes/audio';
import type {Attachment} from '../../sharedTypes';
import {
  isProcessedDraftPhoto,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';

interface BlobCallbacks {
  onSuccess?: (result: Attachment) => void;
  onError?: (err: unknown) => void;
}

export function useCreateBlobMutation() {
  const {projectId} = useActiveProject();

  const {mutate: comapeoMutate, reset, status} = useCreateBlob({projectId});

  function mutate(
    attachment: ProcessedDraftPhoto | UnsavedAudio,
    callbacks?: BlobCallbacks,
  ) {
    const args = createBlobArgs(attachment);

    comapeoMutate(args, {
      onSuccess: comapeoResult => {
        const localResult: Attachment = {
          driveDiscoveryId: comapeoResult.driveId,
          name: comapeoResult.name,
          type: comapeoResult.type,
          hash: comapeoResult.hash,
        };
        callbacks?.onSuccess?.(localResult);
      },
      onError: err => {
        callbacks?.onError?.(err);
      },
    });
  }

  async function mutateAsync(
    attachment: ProcessedDraftPhoto | UnsavedAudio,
  ): Promise<Attachment> {
    return new Promise((resolve, reject) => {
      comapeoMutate(createBlobArgs(attachment), {
        onSuccess: comapeoResult => {
          const localResult: Attachment = {
            driveDiscoveryId: comapeoResult.driveId,
            name: comapeoResult.name,
            type: comapeoResult.type,
            hash: comapeoResult.hash,
          };
          resolve(localResult);
        },
        onError: err => reject(err),
      });
    });
  }

  return {
    mutate,
    mutateAsync,
    reset,
    isPending: status === 'pending',
    isSuccess: status === 'success',
    status,
  };
}

function createBlobArgs(attachment: ProcessedDraftPhoto | UnsavedAudio) {
  if (isProcessedDraftPhoto(attachment)) {
    const {originalUri, previewUri, thumbnailUri, mediaMetadata} = attachment;
    return {
      original: new URL(originalUri).pathname,
      preview: previewUri ? new URL(previewUri).pathname : undefined,
      thumbnail: thumbnailUri ? new URL(thumbnailUri).pathname : undefined,
      // TODO: DraftPhoto type should probably carry MIME type info that feeds this
      // although backend currently only uses first part of path
      metadata: {
        mimeType: 'image/jpeg',
        location: mediaMetadata.location,
        timestamp: mediaMetadata.timestamp,
      },
    };
  } else if (isUnsavedAudio(attachment)) {
    const {uri, createdAt} = attachment;
    return {
      original: new URL(uri).pathname,
      metadata: {
        mimeType: 'audio/mp4',
        timestamp: createdAt,
      },
    };
  }
  throw new Error('Unknown attachment type');
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
) {
  const {projectId} = useActiveProject();

  const blobId = buildBlobId(attachment, variant);

  const {data: rawUrl, error: urlError} = useAttachmentUrl({
    projectId,
    blobId,
  });

  const isPending = !rawUrl && !urlError;

  return {
    data: rawUrl ? {...attachment, url: rawUrl} : undefined,
    error: urlError,
    isPending,
  };
}

function buildBlobId(
  attachment: Attachment,
  requestedVariant: BlobVariant<
    Exclude<
      Observation['attachments'][number]['type'],
      'UNRECOGNIZED' | 'attachment_type_unspecified'
    >
  >,
): BlobId {
  const {type, name, driveDiscoveryId} = attachment;

  if (type === 'audio' || type === 'video') {
    return {
      type,
      variant: 'original',
      name,
      driveId: driveDiscoveryId,
    };
  }

  if (type === 'photo') {
    return {
      type: 'photo',
      variant: requestedVariant,
      name,
      driveId: driveDiscoveryId,
    };
  }

  throw new Error(`Cannot fetch URL for attachment type "${type}"`);
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
