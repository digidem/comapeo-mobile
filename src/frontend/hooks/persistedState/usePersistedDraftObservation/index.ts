import {StateCreator} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {Photo, DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';
import {
  deletePhoto,
  filterPhotosFromAttachments,
  replaceDraftPhotos,
} from './photosMethods';
import {ClientGeneratedObservation, Position} from '../../../sharedTypes';
import {Observation, Preset} from '@mapeo/schema';

export type DraftObservationSlice = {
  photos: Photo[];
  value: Observation | null | ClientGeneratedObservation;
  observationId?: string;
  preset?: Preset;
  actions: {
    addPhotoPlaceholder: (draftPhotoId: string) => void;
    replacePhotoPlaceholderWithPhoto: (photo: DraftPhoto) => void;
    // Clear the current draft
    clearPersistedDraft: () => void;
    // Create a new draft observation
    newPersistedDraft: (id?: string, value?: Observation | null) => void;
    deletePersistedPhoto: (id: string) => void;
    updatePersistedPosition: ({
      position,
      manualLocation,
    }: {
      position?: Position;
      manualLocation?: boolean;
    }) => void;
    updatePersistedPreset: (preset: Preset) => void;
    updatePersistedNotesField: (notes: string) => void;
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
        preset: undefined,
        observationId: undefined,
      }),
    updatePersistedPosition: ({position, manualLocation}) => {
      if (!position || !position.coords) return;
      const prevValue = get().value;
      if (!prevValue)
        throw new Error(
          'Cannot set position if observation does not already exist (aka if the user has not chosen a category)',
        );
      set({
        value: {
          ...prevValue,
          lon: position.coords.longitude,
          lat: position.coords.latitude,
          metadata: {
            ...prevValue.metadata,
            position: position,
            manualLocation,
          },
        },
      });
    },
    newPersistedDraft: (id, value) =>
      set({
        observationId: id,
        photos: value ? filterPhotosFromAttachments(value.attachments) : [],
        value,
        preset: undefined,
      }),
    updatePersistedPreset: preset => {
      const prevValue = get().value;
      if (prevValue) {
        set({
          value: {
            ...prevValue,
            tags: {
              ...prevValue.tags,
              categoryId: preset.docId,
            },
          },
          preset: preset,
        });
        return;
      }
      set({
        value: {
          refs: [],
          tags: {categoryId: preset.docId},
          metadata: {},
        },
        preset: preset,
      });
    },
    updatePersistedNotesField: notes => {
      const prevValue = get().value;
      if (!prevValue)
        throw new Error(
          'Cannot set notes if observation does not already exist (aka if the user has not chosen a category)',
        );
      set({
        value: {
          ...prevValue,
          tags: {
            ...prevValue.tags,
            notes,
          },
        },
      });
    },
  },
});

export const usePersistedDraftObservation = createPersistedState(
  draftObservationSlice,
  '@MapeoDraft',
);

export const _usePersistedDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);
