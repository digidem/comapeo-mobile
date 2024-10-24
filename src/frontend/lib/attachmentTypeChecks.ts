import {Attachment} from '../sharedTypes';
import {Audio, AudioAttachment, UnsavedAudio} from '../sharedTypes/audio';
import {
  Photo,
  SavedPhoto,
  DraftPhoto,
  ProcessedDraftPhoto,
  UnprocessedDraftPhoto,
} from '../contexts/PhotoPromiseContext/types';

export function isCoMapeoCoreAttachment(
  attachment: any,
): attachment is Attachment {
  return (
    attachment &&
    typeof attachment === 'object' &&
    typeof attachment.name === 'string' &&
    typeof attachment.type === 'string' &&
    typeof attachment.hash === 'string' &&
    typeof attachment.driveDiscoveryId === 'string'
  );
}

export function isAudioAttachment(
  attachment: any,
): attachment is AudioAttachment {
  return isCoMapeoCoreAttachment(attachment) && attachment.type === 'audio';
}

export function isUnsavedAudio(attachment: any): attachment is UnsavedAudio {
  return (
    attachment &&
    typeof attachment === 'object' &&
    typeof attachment.uri === 'string' &&
    typeof attachment.duration === 'number' &&
    typeof attachment.createdAt === 'number'
  );
}

export function isAudio(attachment: any): attachment is Audio {
  return isAudioAttachment(attachment) || isUnsavedAudio(attachment);
}

export function isProcessedDraftPhoto(
  attachment: any,
): attachment is ProcessedDraftPhoto {
  return (
    attachment &&
    typeof attachment === 'object' &&
    attachment.type === 'processed' &&
    typeof attachment.draftPhotoId === 'string' &&
    typeof attachment.originalUri === 'string' &&
    typeof attachment.previewUri === 'string' &&
    typeof attachment.thumbnailUri === 'string' &&
    attachment.mediaMetadata &&
    typeof attachment.mediaMetadata === 'object'
  );
}

export function isUnprocessedDraftPhoto(
  attachment: any,
): attachment is UnprocessedDraftPhoto {
  return (
    attachment &&
    typeof attachment === 'object' &&
    attachment.type === 'unprocessed' &&
    typeof attachment.draftPhotoId === 'string'
  );
}

export function isSavedPhoto(attachment: any): attachment is SavedPhoto {
  return isCoMapeoCoreAttachment(attachment) && attachment.type === 'photo';
}

export function isDraftPhoto(attachment: any): attachment is DraftPhoto {
  return (
    isProcessedDraftPhoto(attachment) || isUnprocessedDraftPhoto(attachment)
  );
}

export function isPhoto(attachment: any): attachment is Photo {
  return isSavedPhoto(attachment) || isDraftPhoto(attachment);
}
