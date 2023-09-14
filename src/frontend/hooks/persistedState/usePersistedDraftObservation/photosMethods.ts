import {StoreApi} from 'zustand';
import {DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';
import {DraftObservationSlice} from '.';

export interface ObservationAttachment {
  id: string;
  type?: string;
}

type Setter = StoreApi<DraftObservationSlice>['setState'];
type Getter = StoreApi<DraftObservationSlice>['getState'];
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

  set({photos: newPhotosArray});
}

export function replaceDraftPhotos(
  set: Setter,
  get: Getter,
  draftPhoto: DraftPhoto,
) {
  const updatedPhotosState = get().photos.map(p => {
    if ('draftPhotoId' in p && p.draftPhotoId === draftPhoto.draftPhotoId) {
      return draftPhoto;
    }
    return p;
  });
  set({photos: updatedPhotosState});
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
