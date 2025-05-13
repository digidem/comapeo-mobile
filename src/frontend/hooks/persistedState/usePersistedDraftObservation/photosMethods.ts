import {StoreApi} from 'zustand';
import {DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';
import {isDraftPhoto} from '../../../lib/attachmentTypeChecks';
import {DraftObservationSlice} from '.';

type Setter = StoreApi<DraftObservationSlice>['setState'];
type Getter = StoreApi<DraftObservationSlice>['getState'];

export function deletePhoto(set: Setter, get: Getter, uri: string) {
  const newAttachments = get().attachments.filter(attachment => {
    if (!isDraftPhoto(attachment)) return true;

    if (attachment.type === 'unprocessed') return true;

    return attachment.originalUri !== uri;
  });

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
