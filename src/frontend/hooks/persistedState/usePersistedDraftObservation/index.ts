import {StateCreator} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {Photo, DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';
import {
  deletePhoto,
  filterPhotosFromAttachments,
  replaceDraftPhotos,
} from './photosMethods';
import {PermissionResult} from '../../../contexts/PermissionsContext';
import {
  Observation,
  ClientGeneratedObservation,
  Position,
} from '../../../sharedTypes';
import {Tag} from '../../../../backend/mapeo-core';

export type DraftObservationSlice = {
  photos: Photo[];
  value: Observation | null | ClientGeneratedObservation;
  observationId?: string;
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
    updatePersistedTags: (tag: Tag) => void;
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
    updatePersistedPosition: ({position, manualLocation}) => {
      if (!position || !position.coords) return;
      const prevValue = get().value;
      if (!prevValue)
        throw new Error(
          'Cannot set position if obsevation does not already exist (aka if the user has not chosen a category)',
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
      }),
    updatePersistedTags: tag => {
      const prevValue = get().value;
      if (prevValue) {
        set({
          value: {
            ...prevValue,
            tags: {
              ...prevValue.tags,
              ...tag,
            },
          },
        });
        return;
      }
      set({
        value: {
          tags: tag,
          metadata: {},
        },
      });
    },
  },
});

export const usePersistedDraftObservation = createPersistedState(
  draftObservationSlice,
  '@MapeoDraft',
);

export const usePersistedDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);
