import {LocationObject} from 'expo-location';

export const THUMBNAIL_SIZE = 400;
export const THUMBNAIL_QUALITY = 30;
export const PREVIEW_SIZE = 1200;
export const PREVIEW_QUALITY = 30;

export interface SavedPhoto {
  // id of the photo in the Mapeo database
  id: string;
  type?: 'photo';
  // If an image is to be deleted
  deleted?: boolean;
}

export type UnprocessedDraftPhoto = {
  type: 'unprocessed';
  draftPhotoId: string;
  error?: Error;
  deleted?: boolean;
};

export type ProcessedDraftPhoto = {
  type: 'processed';
  draftPhotoId: string;
  originalUri: string;
  previewUri: string;
  thumbnailUri: string;
  mediaMetadata: MediaMetadata;
  deleted?: boolean;
};

// Photo added to a draft observation, that has not yet been saved
// It is added to the draft observation as soon as capturing starts, when it does not yet have any image associated with it
export type DraftPhoto = UnprocessedDraftPhoto | ProcessedDraftPhoto;

/**
 * A Photo does not become an observation attachment until it is actually saved.
 * Only then are deleted attachments removed from disk, so that we can support
 * cancellation of any edits. During photo capture a preview is available to
 * show in the UI while the full-res photo is saved.
 */
export type Photo = SavedPhoto | DraftPhoto;

export type CapturedPictureMM = {
  uri: string;
  rotate?: number;
};

export interface Signal {
  didCancel?: boolean;
}

export type CancellablePhotoPromise = Promise<ProcessedDraftPhoto> & {
  signal?: Signal;
};

export type MediaMetadata = {
  location?: LocationObject;
  timestamp: number;
};

export type PhotoPromiseWithMetadata = {
  capturePromise: Promise<CapturedPictureMM>;
  mediaMetadata: MediaMetadata;
};
