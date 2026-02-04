/* eslint-disable @typescript-eslint/no-explicit-any */
import {AccelerometerMeasurement} from 'expo-sensors';
import {
  UnsavedAttachmentBlob,
  UnsavedAudioAttachment,
  UnsavedPhotoAttachment,
} from '../contexts/PersistedStores/DraftObservationStore';
import {LocationObject} from 'expo-location';
import {safeParse} from 'valibot';
import {PhotoEXIFSchema} from './exif';

import {Attachment, SavedPhoto} from '../sharedTypes';
import {AudioAttachment} from '../sharedTypes/audio';

function isCoMapeoCoreAttachment(
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

export function isSavedPhoto(attachment: unknown): attachment is SavedPhoto {
  return isCoMapeoCoreAttachment(attachment) && attachment.type === 'photo';
}

function isError(err: unknown): err is Error {
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    'message' in err &&
    (err instanceof Error || typeof (err as any).stack === 'string')
  );
}

function isUnsavedAttachmentBlob(blob: unknown): blob is UnsavedAttachmentBlob {
  if (typeof blob !== 'object' || blob === null) return false;

  const b = blob as Partial<UnsavedAttachmentBlob>;

  if (typeof b.processingState !== 'string') return false;

  switch (b.processingState) {
    case 'complete':
      return typeof b.uri === 'string';
    case 'pending':
      return b.uri === null && !('error' in b);
    case 'error':
      return b.uri === null && 'error' in b && isError(b.error);
    default:
      return false;
  }
}

function isAccelerometerMeasurement(
  obj: unknown,
): obj is AccelerometerMeasurement {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'x' in obj &&
    typeof (obj as any).x === 'number' &&
    'y' in obj &&
    typeof (obj as any).y === 'number' &&
    'z' in obj &&
    typeof (obj as any).z === 'number' &&
    'timestamp' in obj &&
    typeof (obj as any).timestamp === 'number'
  );
}

function isLocationObject(obj: unknown): obj is LocationObject {
  if (typeof obj !== 'object' || obj === null) return false;
  const loc = obj as Partial<LocationObject>;
  return (
    typeof loc.timestamp === 'number' &&
    loc.coords != null &&
    typeof loc.coords === 'object' &&
    typeof loc.coords.latitude === 'number' &&
    typeof loc.coords.longitude === 'number'
  );
}

// --- Main Type Guard ---

export function isUnsavedPhotoAttachment(
  obj: unknown,
): obj is UnsavedPhotoAttachment {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as Partial<UnsavedPhotoAttachment>;

  // Required fields
  if (
    typeof candidate.id !== 'number' ||
    candidate.type !== 'photo' ||
    typeof candidate.timestamp !== 'number' ||
    !isUnsavedAttachmentBlob(candidate.raw) ||
    !isUnsavedAttachmentBlob(candidate.original) ||
    !isUnsavedAttachmentBlob(candidate.thumbnail) ||
    !isUnsavedAttachmentBlob(candidate.preview)
  ) {
    return false;
  }

  // Optional fields
  if (
    'accelerometer' in candidate &&
    candidate.accelerometer !== undefined &&
    !isAccelerometerMeasurement(candidate.accelerometer)
  ) {
    return false;
  }

  if (
    'location' in candidate &&
    candidate.location !== undefined &&
    !isLocationObject(candidate.location)
  ) {
    return false;
  }

  if (
    'photoExif' in candidate &&
    candidate.photoExif !== undefined &&
    !safeParse(PhotoEXIFSchema, candidate.photoExif).success
  ) {
    return false;
  }

  return true;
}

export function isUnsavedAudioAttachment(
  obj: unknown,
): obj is UnsavedAudioAttachment {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as Partial<UnsavedAudioAttachment>;

  return (
    typeof candidate.id === 'number' &&
    candidate.type === 'audio' &&
    isUnsavedAttachmentBlob(candidate.original)
  );
}
