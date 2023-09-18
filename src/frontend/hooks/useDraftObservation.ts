import {useCallback} from 'react';
import {usePhotoPromiseContext} from '../contexts/PhotoPromiseContext';
import {usePersistedDraftObservationActions} from './persistedState/usePersistedDraftObservation';
import {
  CapturedPictureMM,
  Observation,
} from '../contexts/PhotoPromiseContext/types';
import {nanoid} from 'nanoid';

// draft observation have 2 parts:
// 1. All the information, except processed photos are saved to persisted state.
// 2. Photos are processed async (to be turned into a useable format by mapeo). Since promises cannot be stored in persisted storage, we hold those in a context. Once those photos are processed we save them to persisted state.
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
  } = usePersistedDraftObservationActions();

  const addPhoto = useCallback(
    async (capturePromise: Promise<CapturedPictureMM>) => {
      const draftPhotoId = nanoid();
      // adds the originalUri of the unprocessed photo into persisted state (as a placeholder)
      addPhotoPlaceholder(draftPhotoId);
      // creates a promise of the original photo. This promise resolves into a processed photo with the thumbnail, preview, and original photo
      const photoPromise = addPhotoPromise(capturePromise, draftPhotoId);
      try {
        // the promise is run
        const photo = await photoPromise;
        // when the promise has been fufilled, we find the the originalUri of the unprocessed photo, which was saved above in `addPhotoPlaceholder`. The we replace it with the processed photo
        replacePhotoPlaceholderWithPhoto(photo);
      } catch (err) {
        if (!(err instanceof Error)) return;

        const photo = {
          capturing: false,
          error: true,
          draftPhotoId,
        };
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
      capture?: Promise<CapturedPictureMM>,
    ) => {
      cancelPhotoProcessing();
      newPersistedDraft(id, value);
      if (capture) addPhoto(capture);
    },
    [cancelPhotoProcessing, newPersistedDraft],
  );

  const deletePhoto = useCallback((uri: string) => {
    deletePersistedPhoto(uri);
    deletePhotoPromise(uri);
  }, []);

  return {addPhoto, clearDraft, newDraft, updateDraft, deletePhoto};
};
