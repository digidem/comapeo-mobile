import {Setter, Getter} from '.';
import ImageResizer from 'react-native-image-resizer';
import {
  DraftPhoto,
  CancellablePromise,
  CapturedPictureMM,
  Signal,
  THUMBNAIL_SIZE,
  THUMBNAIL_QUALITY,
  PREVIEW_SIZE,
  PREVIEW_QUALITY,
} from './types';

export interface ObservationAttachment {
  id: string;
  type?: string;
}

export interface SavedPhoto {
  // id of the photo in the Mapeo database
  id: string;
  type?: 'image/jpeg';
  // If an image is to be deleted
  deleted?: boolean;
}

export function deletePhoto(set: Setter, get: Getter, uri: string) {
  const newPhotosArray = get().photos.filter(
    photo => 'originalUri' in photo && photo.originalUri !== uri,
  );

  const newPhotoPromiseArray = get().photoPromises.map(async photo => {
    const resolvedPhoto = await photo;
    if (resolvedPhoto.originalUri === uri) {
      const deletedPhoto: Promise<DraftPhoto> = new Promise((res, rej) => {
        resolvedPhoto.deleted = true;
        res(resolvedPhoto);
      });
      const cancelPhoto = deletedPhoto as CancellablePromise<DraftPhoto>;
      cancelPhoto.signal = {didCancel: true};
      return cancelPhoto;
    }

    return photo;
  });

  set({photos: newPhotosArray, photoPromises: newPhotoPromiseArray});
}

export async function addPhoto(
  set: Setter,
  get: Getter,
  capturePromise: Promise<CapturedPictureMM>,
) {
  // Keep a reference of the "in-progress" photo which we save to state, we
  // will use this later to swap it in state with the captured photo
  const capturingPhoto: DraftPhoto = {capturing: true};

  // Use signal to cancel processing by setting signal.didCancel = true
  // Important because image resize/rotate is expensive
  const signal: Signal = {};

  const photoPromise: CancellablePromise<DraftPhoto> = processPhoto(
    capturePromise,
    signal,
  );

  photoPromise.signal = signal;

  set({
    photoPromises: [...get().photoPromises, photoPromise],
    photos: [...get().photos, capturingPhoto],
  });

  let photo: DraftPhoto;

  try {
    photo = await photoPromise;
  } catch (err) {
    if (!(err instanceof Error)) return;

    photo = {capturing: false, error: true};
  } finally {
    // Replace the capturing photo in state with the now captured photo
    const updatedPhotosState = get().photos.map(p =>
      p === capturingPhoto ? photo : p,
    );

    set({photos: updatedPhotosState});
  }
}

export async function processPhoto(
  capturePromise: Promise<CapturedPictureMM>,
  {didCancel = false}: Signal,
) {
  const photo: DraftPhoto = {capturing: false};
  const {uri: originalUri, rotate} = await capturePromise;

  if (didCancel) throw new Error('Cancelled');

  photo.originalUri = originalUri;

  // rotate will be defined if the original photo failed to rotate (this
  // happens on low-memory devices) so we rotate the preview and
  // thumbnail (rotating the smaller images seems to work ok).
  const {uri: thumbnailUri} = await ImageResizer.createResizedImage(
    originalUri,
    THUMBNAIL_SIZE,
    THUMBNAIL_SIZE,
    'JPEG',
    THUMBNAIL_QUALITY,
    rotate,
  );

  if (didCancel) throw new Error('Cancelled');

  photo.thumbnailUri = thumbnailUri;

  const {uri: previewUri} = await ImageResizer.createResizedImage(
    originalUri,
    PREVIEW_SIZE,
    PREVIEW_SIZE,
    'JPEG',
    PREVIEW_QUALITY,
    rotate,
  );

  if (didCancel) throw new Error('Cancelled');

  photo.previewUri = previewUri;

  return photo;
}

// THIS NEED A SETTER
export function cancelPhotoProcessing(set: Setter, get: Getter) {
  // TODO: Cleanup photos and previews in temp storage here
  // Signal any pending photo captures to cancel:
  const newPhotoPromises = get().photoPromises.map(p => ({
    ...p,
    signal: {didCancel: true},
  }));
  set({photoPromises: newPhotoPromises});
}

// Filter photos from an array of observation attachments (we could have videos
// and other media types)
export function filterPhotosFromAttachments(
  attachments: Array<ObservationAttachment> = [],
): Array<SavedPhoto> {
  return attachments.reduce<Array<SavedPhoto>>((acc, att) => {
    if (
      att.type === 'image/jpeg' ||
      // This is needed for backwards compat, because early versions did not
      // save a type
      (att.type === undefined && /(\.jpg|\.jpeg)$/i.test(att.id))
    )
      acc.push({id: att.id, type: att.type});
    return acc;
  }, []);
}
