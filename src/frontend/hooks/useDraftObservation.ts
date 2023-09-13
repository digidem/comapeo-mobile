import {useCallback} from 'react';
import {usePhotoPromiseContext} from '../contexts/DraftObservationContext';
import {useDraftObservationActions} from './persistedState/usePersistedDraftObservation';
import {
  CapturePicturePromiseWithId,
  Observation,
} from '../contexts/DraftObservationContext/types';

export const useDraftObservation = () => {
  const {addPhotoPromise, cancelPhotoProcessing, deletePhotoPromise} =
    usePhotoPromiseContext();
  const {
    addPhotoPlaceholder,
    replacePhotoPlaceholderWithPhoto,
    clearPersistedDraft,
    newPersistedDraft,
    updatePersistedDraft: updateDraft,
    deletePersistedPhoto,
  } = useDraftObservationActions();

  const addPhoto = useCallback(
    async (capturePromise: CapturePicturePromiseWithId) => {
      const {draftPhotoId} = capturePromise;
      addPhotoPlaceholder(draftPhotoId);
      const photoPromise = addPhotoPromise(capturePromise);
      try {
        const photo = await photoPromise;
        replacePhotoPlaceholderWithPhoto(photo);
      } catch (err) {
        if (!(err instanceof Error)) return;

        const photo = {capturing: false, error: true, draftPhotoId};
        replacePhotoPlaceholderWithPhoto(photo);

        if (
          (photoPromise.signal && photoPromise.signal.didCancel) ||
          err.message === 'Cancelled'
        )
          console.log('Cancelled photo');
        else {
          console.log(err);
        }
      }
    },
    [addPhotoPlaceholder, addPhotoPromise, replacePhotoPlaceholderWithPhoto],
  );

  const clearDraft = useCallback(() => {
    cancelPhotoProcessing();
    clearPersistedDraft();
  }, [cancelPhotoProcessing, clearPersistedDraft]);

  const newDraft = useCallback(
    (
      id?: string,
      value?: Observation | null,
      capture?: CapturePicturePromiseWithId,
    ) => {
      cancelPhotoProcessing();
      newPersistedDraft(id, value, capture);
    },
    [cancelPhotoProcessing, newPersistedDraft],
  );

  const deletePhoto = useCallback((uri: string) => {
    deletePersistedPhoto(uri);
    deletePhotoPromise(uri);
  }, []);

  return {addPhoto, clearDraft, newDraft, updateDraft, deletePhoto};
};
