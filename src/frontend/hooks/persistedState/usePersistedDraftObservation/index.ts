import {StateCreator, StoreApi} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {
  Photo,
  Observation,
  DraftPhoto,
} from '../../../contexts/DraftObservationContext/types';
import {
  deletePhoto,
  filterPhotosFromAttachments,
  replaceDraftPhotos,
} from './photosMethods';
import {CapturePicturePromiseWithId} from '../../../contexts/DraftObservationContext';

export type DraftObservationSlice = {
  photos: Photo[];
  value: Observation | null;
  observationId?: string;
  actions: {
    addPhotoPlaceholder: (draftPhotoId: string) => void;
    replacePhotoPlaceholderWithPhoto: (photo: DraftPhoto) => void;
    // Performs a shallow merge of the observation value, like setState
    updatePersistedDraft: (value: Observation) => void;
    // Clear the current draft
    clearPersistedDraft: () => void;
    // Create a new draft observation
    newPersistedDraft: (
      id?: string,
      value?: Observation | null,
      capture?: CapturePicturePromiseWithId,
    ) => void;
    deletePersistedPhoto: (id: string) => void;
  };
};

const draftObservationSlice: StateCreator<DraftObservationSlice> = (
  set,
  get,
) => ({
  photos: [],
  value: null,
  actions: {
    deletePersistedPhoto: id => deletePhoto(set, get, id),
    addPhotoPlaceholder: draftPhotoId =>
      set({photos: [...get().photos, {draftPhotoId, capturing: true}]}),
    replacePhotoPlaceholderWithPhoto: draftPhoto =>
      replaceDraftPhotos(set, get, draftPhoto),
    clearPersistedDraft: () =>
      set({
        photos: [],
        value: null,
      }),
    updatePersistedDraft: value => set({value}),
    newPersistedDraft: (id, value) =>
      set({
        observationId: id,
        photos: value ? filterPhotosFromAttachments(value.attachments) : [],
        value,
      }),
  },
});

export const usePersistedDraftObservation = createPersistedState(
  draftObservationSlice,
  '@MapeoDraft',
);

export const useDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);
