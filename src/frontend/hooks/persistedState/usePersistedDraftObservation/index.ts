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
import {Position} from '../../../contexts/LocationContext';
import {PermissionResult} from '../../../contexts/PermissionsContext';

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
    newPersistedDraft: (id?: string, value?: Observation | null) => void;
    deletePersistedPhoto: (id: string) => void;
    updatePersistedPosition: ({
      position,
      error,
      permissionResult,
    }: {
      position?: Position;
      error?: boolean;
      permissionResult?: PermissionResult;
    }) => void;
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
    updatePersistedDraft: newValue =>
      set({value: {...get().value, ...newValue}}),
    updatePersistedPosition: ({position, error, permissionResult}) => {
      if (!position) return;
      const prevValue = get().value;
      if (!prevValue)
        throw new Error(
          'Cannot update persisted position if draft value has not been initialized',
        );
      set({
        value: {
          ...prevValue,
          lon: position.coords.longitude,
          lat: position.coords.latitude,
          metadata: {
            ...prevValue.metadata,
            location:
              !error || !permissionResult
                ? undefined
                : {permission: permissionResult, error: error},
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
  },
});

export const usePersistedDraftObservation = createPersistedState(
  draftObservationSlice,
  '@MapeoDraft',
);

export const usePersistedDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);
