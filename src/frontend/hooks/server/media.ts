import {useAttachmentUrl, useCreateBlob} from '@comapeo/core-react';
import type {BlobId, BlobVariant} from '@comapeo/core/dist/types';
import type {Observation} from '@comapeo/schema';
import {useMutation} from '@tanstack/react-query';
import {URL} from 'react-native-url-polyfill';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import type {ProcessedDraftPhoto} from '../../contexts/PhotoPromiseContext/types';
import type {Attachment} from '../../sharedTypes';
import type {UnsavedAudio} from '../../sharedTypes/audio';

export function useCreatePhotoAttachment({projectId}: {projectId: string}) {
  const {mutateAsync: createBlobAsync} = useCreateBlob({projectId});

  return useMutation({
    mutationFn: async (photo: ProcessedDraftPhoto): Promise<Attachment> => {
      const blob = await createBlobAsync({
        original: new URL(photo.originalUri).pathname,
        preview: photo.previewUri
          ? new URL(photo.previewUri).pathname
          : undefined,
        thumbnail: photo.thumbnailUri
          ? new URL(photo.thumbnailUri).pathname
          : undefined,
        // TODO: DraftPhoto type should probably carry MIME type info that feeds this
        // although backend currently only uses first part of path
        metadata: {
          mimeType: 'image/jpeg',
          location: photo.mediaMetadata.location,
          timestamp: photo.mediaMetadata.timestamp,
        },
      });

      const baseAttachment = {
        driveDiscoveryId: blob.driveId,
        hash: blob.hash,
        name: blob.name,
        type: blob.type,
      };

      // Should not happen but just in case...
      if (blob.type !== 'photo') {
        return baseAttachment;
      }

      return {
        ...baseAttachment,
        photoExif: photo.mediaMetadata.photoExif,
      };
    },
  });
}

export function useCreateAudioAttachment({projectId}: {projectId: string}) {
  const {mutateAsync: createBlobAsync} = useCreateBlob({projectId});

  return useMutation({
    mutationFn: async (file: UnsavedAudio): Promise<Attachment> => {
      const blob = await createBlobAsync({
        original: new URL(file.uri).pathname,
        metadata: {
          mimeType: 'audio/mp4',
          timestamp: file.createdAt,
        },
      });

      return {
        driveDiscoveryId: blob.driveId,
        hash: blob.hash,
        name: blob.name,
        type: blob.type,
      };
    },
  });
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

  const blobId = buildBlobId(
    {
      driveDiscoveryId: attachment.driveDiscoveryId,
      name: attachment.name,
      type: attachment.type as 'photo' | 'audio' | 'video',
      hash: attachment.hash,
    },
    variant,
  );

  const {
    data: rawUrl,
    error,
    isRefetching,
  } = useAttachmentUrl({
    projectId,
    blobId,
  });

  return {
    url: rawUrl ?? undefined,
    error,
    isRefetching,
  };
}
