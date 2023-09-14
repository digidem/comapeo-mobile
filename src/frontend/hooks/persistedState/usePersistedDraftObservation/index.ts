import {StateCreator} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {
  Photo,
  Observation,
  DraftPhoto,
} from '../../../contexts/PhotoPromiseContext/types';
import {
  deletePhoto,
  filterPhotosFromAttachments,
  replaceDraftPhotos,
} from './photosMethods';

export type DraftObservationSlice = {
  photos: Photo[];
  value: Observation | null;
  observationId?: string;
  actions: {
    addPhotoPlaceholder: (originalUri: string) => void;
    replacePhotoPlaceholderWithPhoto: (photo: DraftPhoto) => void;
    // Performs a shallow merge of the observation value, like setState
    updatePersistedDraft: (value: Observation) => void;
    // Clear the current draft
    clearPersistedDraft: () => void;
    // Create a new draft observation
    newPersistedDraft: (id?: string, value?: Observation | null) => void;
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
    addPhotoPlaceholder: originalUri =>
      set({photos: [...get().photos, {originalUri, capturing: true}]}),
    replacePhotoPlaceholderWithPhoto: draftPhoto =>
      replaceDraftPhotos(set, get, draftPhoto),
    clearPersistedDraft: () =>
      set({
        photos: [],
        value: null,
      }),
    updatePersistedDraft: newValue =>
      set({value: {...get().value, ...newValue}}),
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

export const usePersistedDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);
