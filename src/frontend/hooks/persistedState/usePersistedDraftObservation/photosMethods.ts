import {StoreApi} from 'zustand';
import {DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';
import {DraftObservationSlice} from '.';
import {ObservationValue} from '@mapeo/schema';

type Setter = StoreApi<DraftObservationSlice>['setState'];
type Getter = StoreApi<DraftObservationSlice>['getState'];
export interface SavedPhoto {
  driveDiscoveryId: string;
  hash: string;
  // id of the photo in the Mapeo database
  id: string;
  name: string;
  type?: 'photo';
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
  attachments: ObservationValue['attachments'] = [],
): Array<SavedPhoto> {
  if (!attachments || attachments.length < 1) return [];

  return attachments.reduce<Array<SavedPhoto>>((acc, att) => {
    if (
      att.type === 'photo' ||
      // This is needed for backwards compat, because early versions did not
      // save a type
      (att.type === undefined && /(\.jpg|\.jpeg)$/i.test(att.hash))
    )
      acc.push({
        driveDiscoveryId: att.driveDiscoveryId,
        hash: att.hash,
        id: `${att.driveDiscoveryId}/${att.type}/${att.name}`,
        name: att.name,
        type: att.type,
      });
    return acc;
  }, []);
}
