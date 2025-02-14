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
  attachment: unknown,
): attachment is Attachment {
  return !!(
    attachment &&
    typeof attachment === 'object' &&
    'name' in attachment &&
    typeof attachment.name === 'string' &&
    'type' in attachment &&
    typeof attachment.type === 'string' &&
    'hash' in attachment &&
    typeof attachment.hash === 'string' &&
    'driveDiscoveryId' in attachment &&
    typeof attachment.driveDiscoveryId === 'string'
  );
}

export function isAudioAttachment(
  attachment: unknown,
): attachment is AudioAttachment {
  return isCoMapeoCoreAttachment(attachment) && attachment.type === 'audio';
}

export function isUnsavedAudio(
  attachment: unknown,
): attachment is UnsavedAudio {
  return !!(
    attachment &&
    typeof attachment === 'object' &&
    'uri' in attachment &&
    typeof attachment.uri === 'string' &&
    'duration' in attachment &&
    typeof attachment.duration === 'number' &&
    'createdAt' in attachment &&
    typeof attachment.createdAt === 'number'
  );
}

export function isAudio(attachment: unknown): attachment is Audio {
  return isAudioAttachment(attachment) || isUnsavedAudio(attachment);
}

export function isProcessedDraftPhoto(
  attachment: unknown,
): attachment is ProcessedDraftPhoto {
  return !!(
    attachment &&
    typeof attachment === 'object' &&
    'type' in attachment &&
    attachment.type === 'processed' &&
    'draftPhotoId' in attachment &&
    typeof attachment.draftPhotoId === 'string' &&
    'originalUri' in attachment &&
    typeof attachment.originalUri === 'string' &&
    'previewUri' in attachment &&
    typeof attachment.previewUri === 'string' &&
    'thumbnailUri' in attachment &&
    typeof attachment.thumbnailUri === 'string' &&
    'mediaMetadata' in attachment &&
    attachment.mediaMetadata &&
    typeof attachment.mediaMetadata === 'object'
  );
}

export function isUnprocessedDraftPhoto(
  attachment: unknown,
): attachment is UnprocessedDraftPhoto {
  return !!(
    attachment &&
    typeof attachment === 'object' &&
    'unprocessed' in attachment &&
    'type' in attachment &&
    attachment.type === 'unprocessed' &&
    'draftPhotoId' in attachment &&
    typeof attachment.draftPhotoId === 'string'
  );
}

export function isSavedPhoto(attachment: unknown): attachment is SavedPhoto {
  return isCoMapeoCoreAttachment(attachment) && attachment.type === 'photo';
}

export function isDraftPhoto(attachment: unknown): attachment is DraftPhoto {
  return (
    isProcessedDraftPhoto(attachment) || isUnprocessedDraftPhoto(attachment)
  );
}

export function isPhoto(attachment: unknown): attachment is Photo {
  return isSavedPhoto(attachment) || isDraftPhoto(attachment);
}
