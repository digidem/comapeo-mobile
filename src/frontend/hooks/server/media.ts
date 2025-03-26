import {URL} from 'react-native-url-polyfill';
import {useCreateBlob, useAttachmentUrl} from '@comapeo/core-react';
import {Observation} from '@comapeo/schema';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {
  isProcessedDraftPhoto,
  isUnsavedAudio,
} from '../../lib/attachmentTypeChecks';
import {ProcessedDraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import {UnsavedAudio} from '../../sharedTypes/audio';
import {BlobId, BlobVariant} from '@comapeo/core/dist/types';
import {useMutation} from '@tanstack/react-query';

interface Attachment {
  driveDiscoveryId: string;
  name: string;
  type: 'photo' | 'audio' | 'video';
  hash: string;
}

export function useCreateAttachment() {
  const {projectId} = useActiveProject();
  const createBlobMutation = useCreateBlob({projectId});

  const wrappedMutation = useMutation({
    mutationFn: (
      file: ProcessedDraftPhoto | UnsavedAudio,
    ): Promise<Attachment> => {
      return new Promise((res, rej) => {
        createBlobMutation.mutate(createBlobArgs(file), {
          onError: rej,
          onSuccess: data => {
            res({
              driveDiscoveryId: data.driveId,
              name: data.name,
              type: data.type,
              hash: data.hash,
            });
          },
        });
      });
    },
  });

  return wrappedMutation;
}

function createBlobArgs(file: ProcessedDraftPhoto | UnsavedAudio) {
  if (isProcessedDraftPhoto(file)) {
    const {originalUri, previewUri, thumbnailUri, mediaMetadata} = file;
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
  } else if (isUnsavedAudio(file)) {
    const {uri, createdAt} = file;
    return {
      original: new URL(uri).pathname,
      metadata: {
        mimeType: 'audio/mp4',
        timestamp: createdAt,
      },
    };
  }
  throw new Error('Unknown file type');
}

function buildBlobId(
  attachment: Attachment,
  requestedVariant: 'original' | 'thumbnail' | 'preview',
): BlobId {
  if (
    attachment.type !== 'photo' &&
    attachment.type !== 'audio' &&
    attachment.type !== 'video'
  ) {
    throw new Error(
      `Cannot fetch URL for attachment type "${attachment.type}"`,
    );
  }

  if (attachment.type === 'photo') {
    return {
      type: 'photo',
      variant: requestedVariant,
      name: attachment.name,
      driveId: attachment.driveDiscoveryId,
    } satisfies BlobId;
  }

  return {
    type: attachment.type,
    variant: 'original',
    name: attachment.name,
    driveId: attachment.driveDiscoveryId,
  } satisfies BlobId;
}

export function useAttachmentUrlQuery(
  attachment: Observation['attachments'][0],
  variant: BlobVariant<'photo' | 'audio' | 'video'>,
) {
  const {projectId} = useActiveProject();
  if (
    attachment.type === 'UNRECOGNIZED' ||
    attachment.type === 'attachment_type_unspecified'
  ) {
    throw new Error(`Invalid attachment type: ${attachment.type}`);
  }

  const validAttachment: {
    driveDiscoveryId: string;
    name: string;
    type: 'photo' | 'audio' | 'video';
    hash: string;
  } = {
    driveDiscoveryId: attachment.driveDiscoveryId,
    name: attachment.name,
    type: attachment.type as 'photo' | 'audio' | 'video',
    hash: attachment.hash,
  };

  const blobId = buildBlobId(validAttachment, variant);

  const {data: rawUrl, error} = useAttachmentUrl({
    projectId,
    blobId,
  });

  return {
    data: rawUrl ? {...validAttachment, url: rawUrl} : undefined,
    error,
    isPending: !rawUrl && !error,
  };
}
