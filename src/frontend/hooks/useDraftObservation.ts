import {useCallback, useId} from 'react';
import {
  processPhoto,
  usePhotoPromiseContext,
} from '../contexts/PhotoPromiseContext';
import {
  useDraftObservationActions,
  usePersistedDraftObservation,
} from './persistedState/usePersistedDraftObservation';
import {
  CancellablePhotoPromise,
  CapturePicturePromiseWithId,
  CapturedPictureMM,
  DraftPhoto,
  Observation,
  Signal,
} from '../contexts/PhotoPromiseContext/types';

export const useDraftObservation = () => {
  const {addPhotoPromise, cancelPhotoProcessing, deletePhotoPromise} =
    usePhotoPromiseContext();
  const draftPhotoId = useId();
  const {
    addPhotoPlaceholder,
    replacePhotoPlaceholderWithPhoto,
    clearPersistedDraft,
    newPersistedDraft,
    updatePersistedDraft: updateDraft,
    deletePersistedPhoto,
  } = useDraftObservationActions();

  const addPhoto = useCallback(
    async (capturePromise: Promise<CapturedPictureMM>) => {
      // create id here

      addPhotoPlaceholder(draftPhotoId);
      const photoPromise = addPhotoPromise({
        draftPhotoId,
        promise: capturePromise,
      });
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
