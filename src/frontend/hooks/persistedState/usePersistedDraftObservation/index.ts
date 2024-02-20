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
import {usePresetsQuery} from '../../server/presets';
import {matchPreset} from '../../../lib/utils';

type newDraftProps = {observation: Observation; preset: Preset};
const emptyObservation: ClientGeneratedObservation = {
  metadata: {},
  refs: [],
  tags: {
    notes: '',
  },
  attachments: [],
};

export type DraftObservationSlice = {
  photos: Photo[];
  value: Observation | null | ClientGeneratedObservation;
  observationId?: string;
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
    updateTags: (tagKey: string, value: Observation['tags'][0]) => void;
    updatePreset: (preset: Preset) => void;
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
        observationId: draftProps.observation.docId,
        photos:
          draftProps.observation.attachments.length > 0
            ? filterPhotosFromAttachments(draftProps.observation.attachments)
            : [],
      });
    },
    updateTags: (tagKey, tagValue) => {
      const prevValue = get().value;
      if (!prevValue)
        throw new Error(
          'cannot update the tags until a draft has been initialized and a preset has been chosem',
        );

      set({
        value: {
          ...prevValue,
          tags: {
            ...prevValue.tags,
            [tagKey]: tagValue,
          },
        },
      });
      return;
    },
    updatePreset: ({tags, fieldIds}) => {
      const prevValue = get().value;
      if (!prevValue) {
        set({
          value: {
            refs: [],
            tags: tags,
            metadata: {},
          },
        });
        return;
      }
      // we want to keep any field tags that are the same from the previous preset
      const savedFieldTags = Object.fromEntries(
        Object.entries(prevValue.tags).filter(([key]) =>
          fieldIds.includes(key),
        ),
      );

      set({
        value: {
          ...prevValue,
          tags: {
            ...tags,
            ...savedFieldTags,
            ...(prevValue.tags.notes ? {notes: prevValue.tags.notes} : {}),
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

export const usePreset = () => {
  const {data: presets} = usePresetsQuery();
  const tags = usePersistedDraftObservation(store => store.value?.tags);
  return !tags ? undefined : matchPreset(tags, presets);
};

export const _usePersistedDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);
