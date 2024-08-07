import {StoreApi} from 'zustand';
import {DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';
import {DraftObservationSlice} from '.';

type Setter = StoreApi<DraftObservationSlice>['setState'];
type Getter = StoreApi<DraftObservationSlice>['getState'];

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
