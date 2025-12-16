import {AccelerometerMeasurement} from 'expo-sensors';
import {UnsavedAttachmentBlob} from '../contexts/PersistedStores/DraftObservationStore';
import {LocationObject} from 'expo-location';

export type UnsavedPhotoAttachment = {
  id: number;
  type: 'photo';
  raw: UnsavedAttachmentBlob;
  original: UnsavedAttachmentBlob;
  thumbnail: UnsavedAttachmentBlob;
  preview: UnsavedAttachmentBlob;
  accelerometer?: AccelerometerMeasurement;
  location?: LocationObject;
  timestamp: number;
  abortController: AbortController;
};

// --- Type Guards ---

function isAbortController(value: unknown): value is AbortController {
  return (
    typeof value === 'object' &&
    value !== null &&
    value instanceof AbortController
  );
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
    !isAbortController(candidate.abortController) ||
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

  return true;
}
