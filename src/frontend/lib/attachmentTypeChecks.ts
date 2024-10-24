import {Audio, AudioAttachment, UnsavedAudio} from '../sharedTypes/audio';
import {
  Photo,
  SavedPhoto,
  DraftPhoto,
  ProcessedDraftPhoto,
  UnprocessedDraftPhoto,
} from '../contexts/PhotoPromiseContext/types';

export function isAudio(attachment: any): attachment is Audio {
  return isAudioAttachment(attachment) || isUnsavedAudio(attachment);
}

export function isAudioAttachment(
  attachment: any,
): attachment is AudioAttachment {
  return 'type' in attachment && attachment.type === 'audio';
}

export function isUnsavedAudio(attachment: any): attachment is UnsavedAudio {
  return 'uri' in attachment && !('driveDiscoveryId' in attachment);
}

export function isPhoto(attachment: any): attachment is Photo {
  return isSavedPhoto(attachment) || isDraftPhoto(attachment);
}

export function isSavedPhoto(attachment: any): attachment is SavedPhoto {
  return 'type' in attachment && attachment.type === 'photo';
}

export function isDraftPhoto(attachment: any): attachment is DraftPhoto {
  return (
    isProcessedDraftPhoto(attachment) || isUnprocessedDraftPhoto(attachment)
  );
}

export function isProcessedDraftPhoto(
  attachment: any,
): attachment is ProcessedDraftPhoto {
  return 'type' in attachment && attachment.type === 'processed';
}

export function isUnprocessedDraftPhoto(
  attachment: any,
): attachment is UnprocessedDraftPhoto {
  return 'type' in attachment && attachment.type === 'unprocessed';
}
