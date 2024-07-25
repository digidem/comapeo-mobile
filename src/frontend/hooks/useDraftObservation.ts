import {useCallback} from 'react';
import {usePhotoPromiseContext} from '../contexts/PhotoPromiseContext';
import {
  _usePersistedDraftObservationActions,
  usePreset,
} from './persistedState/usePersistedDraftObservation';
import {
  PhotoPromiseWithMetadata,
  UnprocessedDraftPhoto,
} from '../contexts/PhotoPromiseContext/types';
// react native does not have a random bytes generator, `non-secure` does not require a random bytes generator.
import {nanoid} from 'nanoid/non-secure';
import {Observation, Preset} from '@mapeo/schema';
import * as Sentry from '@sentry/react-native';

// draft observation have 2 parts:
// 1. All the information, except processed photos are saved to persisted state.
// 2. Photos are processed (to be turned into a useable format by mapeo) async. Since promises cannot be stored in persisted storage, we hold those in a context. Once those photos are processed we save them to persisted state.
export const useDraftObservation = () => {
  const {addPhotoPromise, cancelPhotoProcessing, deletePhotoPromise} =
    usePhotoPromiseContext();

  const {
    addPhotoPlaceholder,
    replacePhotoPlaceholderWithPhoto,
    clearDraft: clearPersistedDraft,
    newDraft: newPersistedDraft,
    updateObservationPosition,
    deletePhoto: deletePersistedPhoto,
    updateTags,
    updatePreset,
  } = _usePersistedDraftObservationActions();

  const addPhoto = useCallback(
    async ({capturePromise, mediaMetadata}: PhotoPromiseWithMetadata) => {
      // creates an id, that is stored as a placeholder in persisted photots. This is associated with the processed photo, so when the photo is done processsing, we can replace the placeholder with the actual photo
      const draftPhotoId = nanoid();
      addPhotoPlaceholder(draftPhotoId);
      // creates a promise of the original photo. This promise resolves into a processed photo with the thumbnail, preview, and original photo
      const photoPromise = addPhotoPromise({
        draftPhotoId,
        mediaMetadata,
        photo: capturePromise,
      });
      try {
        // the promise is run
        const photo = await photoPromise;
        // when the promise has been fufilled, we find the the id of the unprocessed photo, which was saved above in `addPhotoPlaceholder`. The we replace it with the processed photo
        replacePhotoPlaceholderWithPhoto(photo);
      } catch (err) {
        if (!(err instanceof Error)) return;

        const photo: UnprocessedDraftPhoto = {
          error: err,
          draftPhotoId,
          type: 'unprocessed',
        };
        replacePhotoPlaceholderWithPhoto(photo);

        if (
          (photoPromise.signal && photoPromise.signal.didCancel) ||
          err.message === 'Cancelled'
        )
          console.log('Cancelled photo');
        else {
          Sentry.captureException(err);
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
    (photoPromiseWithMetadata?: PhotoPromiseWithMetadata) => {
      cancelPhotoProcessing();
      newPersistedDraft();
      if (photoPromiseWithMetadata) addPhoto(photoPromiseWithMetadata);
    },
    [cancelPhotoProcessing, newPersistedDraft, addPhoto],
  );

  const editSavedObservation = useCallback(
    ({observation, preset}: {observation: Observation; preset: Preset}) => {
      cancelPhotoProcessing();
      newPersistedDraft({observation, preset});
    },
    [newPersistedDraft, cancelPhotoProcessing],
  );

  const deletePhoto = useCallback(
    (uri: string) => {
      deletePersistedPhoto(uri);
      deletePhotoPromise(uri);
    },
    [deletePersistedPhoto, deletePhotoPromise],
  );

  return {
    addPhoto,
    clearDraft,
    newDraft,
    deletePhoto,
    updateObservationPosition,
    updateTags,
    editSavedObservation,
    updatePreset,
    usePreset,
  };
};
