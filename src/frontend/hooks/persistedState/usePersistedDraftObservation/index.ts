import {StateCreator, StoreApi} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {
  Photo,
  Observation,
  DraftPhoto,
  Signal,
  CapturedPictureMM,
} from './types';
import {
  addPhoto,
  cancelPhotoProcessing,
  deletePhoto,
  filterPhotosFromAttachments,
} from './photosMethods';

export type Setter = StoreApi<DraftObservationSlice>['setState'];
export type Getter = StoreApi<DraftObservationSlice>['getState'];

type DraftObservationSlice = {
  photos: Photo[];
  value: Observation | null;
  photoPromises: (Promise<DraftPhoto> & {signal?: Signal})[];
  observationId?: string;
  actions: {
    addPhoto: (capture: Promise<CapturedPictureMM>) => Promise<void>;
    // Performs a shallow merge of the observation value, like setState
    updateDraft: (value: Observation) => void;
    // Clear the current draft
    clearDraft: () => void;
    // Create a new draft observation
    newDraft: (
      id?: string,
      value?: Observation | null,
      capture?: Promise<CapturedPictureMM>,
    ) => void;
    deletePhoto: (id: string) => void;
  };
};

const draftObservationSlice: StateCreator<DraftObservationSlice> = (
  set,
  get,
) => ({
  photos: [],
  value: null,
  photoPromises: [],
  actions: {
    deletePhoto: id => deletePhoto(set, get, id),
    addPhoto: capture => addPhoto(set, get, capture),
    clearDraft: () => clearDraft(set, get),
    updateDraft: value => set({value}),
    newDraft: (id, value, capture) => newDraft(set, get, id, value, capture),
  },
});

export const usePersistedDraftObservation = createPersistedState(
  draftObservationSlice,
  '@MapeoDraft',
);

export const useDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);

function clearDraft(set: Setter, get: Getter) {
  cancelPhotoProcessing(set, get);
  set({
    photoPromises: [],
    photos: [],
    value: null,
  });
}

function newDraft(
  set: Setter,
  get: Getter,
  id?: string,
  value?: Observation | null,
  capture?: Promise<CapturedPictureMM>,
) {
  cancelPhotoProcessing(set, get);

  set({
    observationId: id,
    photoPromises: [],
    photos: value ? filterPhotosFromAttachments(value.attachments) : [],
    value,
  });

  if (capture) addPhoto(set, get, capture);
}
