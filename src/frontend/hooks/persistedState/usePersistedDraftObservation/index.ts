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

type newDraftProps = {observation: Observation; preset: Preset};
const emptyObservation: ClientGeneratedObservation = {
  metadata: {},
  refs: [],
  tags: {
    notes: '',
  },
};

export type DraftObservationSlice = {
  photos: Photo[];
  value: Observation | null | ClientGeneratedObservation;
  observationId?: string;
  preset?: Preset;
  actions: {
    addPhotoPlaceholder: (draftPhotoId: string) => void;
    replacePhotoPlaceholderWithPhoto: (photo: DraftPhoto) => void;
    // Clear the current draft
    clearDraft: () => void;
    // Create a new draft observation
    newDraft: (observation?: newDraftProps) => void;
    deletePhoto: (id: string) => void;
    updateObservationPosition: (props: {
      position: Position | undefined;
      manualLocation: boolean;
    }) => void;
    updatePreset: (preset: Preset) => void;
    updateObservationNotes: (notes: string) => void;
  };
};

const draftObservationSlice: StateCreator<DraftObservationSlice> = (
  set,
  get,
) => ({
  photos: [],
  value: null,
  actions: {
    deletePhoto: id => deletePhoto(set, get, id),
    addPhotoPlaceholder: draftPhotoId =>
      set({photos: [...get().photos, {draftPhotoId, capturing: true}]}),
    replacePhotoPlaceholderWithPhoto: draftPhoto =>
      replaceDraftPhotos(set, get, draftPhoto),
    clearDraft: () => {
      set({
        photos: [],
        value: null,
        preset: undefined,
        observationId: undefined,
      });
    },
    updateObservationPosition: props => {
      const prevValue = get().value;
      if (!prevValue)
        throw new Error(
          'cannot update the draft position until a draft has been initialized',
        );

      set({
        value: {
          ...prevValue,
          lon: props?.position?.coords?.longitude,
          lat: props?.position?.coords?.latitude,
          metadata: {
            ...prevValue.metadata,
            position: props.position,
          },
        },
      });
    },
    newDraft: draftProps => {
      get().actions.clearDraft();
      if (!draftProps) {
        set({
          value: emptyObservation,
        });
        return;
      }

      set({
        value: draftProps.observation,
        preset: draftProps.preset,
        observationId: draftProps.observation.docId,
        photos:
          draftProps.observation.attachments.length > 0
            ? filterPhotosFromAttachments(draftProps.observation.attachments)
            : [],
      });
    },
    updatePreset: preset => {
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
    updateObservationNotes: notes => {
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
