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

// Photo added to a draft observation, that has not yet been saved
// It is added to the draft observation as soon as capturing starts, when it
// does not yet have any image associated with it
export interface DraftPhoto {
  // If the photo is still being captured
  capturing: boolean;
  draftPhotoId: string;
  // uri to a local full-resolution image (this is uploaded to Mapeo server)
  originalUri?: string;
  // uri to a local thumbnail image (this is uploaded to Mapeo server)
  thumbnailUri?: string;
  // uri to a local preview image
  previewUri?: string;
  // If an image is to be deleted
  deleted?: boolean;
  // If there was any kind of error on image capture
  error?: boolean;
}

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

export type CancellablePhotoPromise = Promise<DraftPhoto> & {signal?: Signal};

export type MediaMetadata = {
  location: LocationObject;
  timestamp: number;
};
