import {StoreApi} from 'zustand';
import {DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';
import {DraftObservationStoreState} from '.';

type Setter = StoreApi<DraftObservationStoreState>['setState'];
type Getter = StoreApi<DraftObservationStoreState>['getState'];

export function deletePhoto(set: Setter, get: Getter, uri: string) {
  const newAttachments = get().attachments.filter(
    photo => 'originalUri' in photo && photo.originalUri !== uri,
  );

  set({attachments: newAttachments});
}

export function replaceDraftPhotos(
  set: Setter,
  get: Getter,
  draftPhoto: DraftPhoto,
) {
  const updatedAttachments = get().attachments.map(p => {
    if ('draftPhotoId' in p && p.draftPhotoId === draftPhoto.draftPhotoId) {
      return draftPhoto;
    }
    return p;
  });
  set({attachments: updatedAttachments});
}
