import {StateCreator} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {
  DraftPhoto,
  Photo,
  SavedPhoto,
} from '../../../contexts/PhotoPromiseContext/types';
import {deletePhoto, replaceDraftPhotos} from './photosMethods';
import {
  ClientGeneratedObservation,
  Position,
  AudioRecording,
} from '../../../sharedTypes';
import {Observation, Preset} from '@comapeo/schema';
import {usePresetsQuery} from '../../server/presets';
import {matchPreset} from '../../../lib/utils';

const emptyObservation: ClientGeneratedObservation = {
  lat: 0,
  lon: 0,
  metadata: {manualLocation: false},
  tags: {
    notes: '',
  },
  attachments: [],
};

export type DraftObservationSlice = {
  photos: Photo[];
  audioRecordings: AudioRecording[];
  value: Observation | null | ClientGeneratedObservation;
  observationId?: string;
  actions: {
    addPhotoPlaceholder: (draftPhotoId: string) => void;
    replacePhotoPlaceholderWithPhoto: (draftPhoto: DraftPhoto) => void;
    // Clear the current draft
    clearDraft: () => void;
    // Create a new draft observation
    newDraft: () => void;
    deletePhoto: (uri: string) => void;
    existingObservationToDraft: (observation: Observation) => void;
    updateObservationPosition: (
      props:
        | {
            manualLocation: false;
            position: Position | undefined;
          }
        | {
            manualLocation: true;
            position: {
              coords: {
                latitude: number;
                longitude: number;
              };
            };
          },
    ) => void;
    updateTags: (tagKey: string, value: Observation['tags'][0]) => void;
    updatePreset: (preset: Preset) => void;
    addAudioRecording: (audioRecording: AudioRecording) => void;
  };
};

const draftObservationSlice: StateCreator<DraftObservationSlice> = (
  set,
  get,
) => ({
  photos: [],
  audioRecordings: [],
  value: null,
  actions: {
    deletePhoto: uri => deletePhoto(set, get, uri),
    addPhotoPlaceholder: draftPhotoId =>
      set({photos: [...get().photos, {type: 'unprocessed', draftPhotoId}]}),
    replacePhotoPlaceholderWithPhoto: draftPhoto =>
      replaceDraftPhotos(set, get, draftPhoto),
    clearDraft: () => {
      set({
        photos: [],
        audioRecordings: [],
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

      if (props.manualLocation) {
        set({
          value: {
            ...prevValue,
            lon: props.position.coords.longitude,
            lat: props.position.coords.latitude,
            metadata: {
              manualLocation: props.manualLocation,
            },
          },
        });
      } else {
        set({
          value: {
            ...prevValue,
            lon: props.position?.coords?.longitude,
            lat: props.position?.coords?.latitude,
            metadata: {
              ...prevValue.metadata,
              position: props.position,
              manualLocation: props.manualLocation,
            },
          },
        });
      }
    },
    existingObservationToDraft: async observation => {
      set({
        value: observation,
        observationId: observation.docId,
        photos: observation.attachments.filter(
          (att): att is SavedPhoto => att.type === 'photo',
        ),
      });
    },
    newDraft: () => {
      get().actions.clearDraft();
      set({
        value: emptyObservation,
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
    updatePreset: ({tags, fieldRefs}) => {
      const prevValue = get().value;
      if (!prevValue) {
        set({
          value: {
            ...emptyObservation,
            tags,
          },
        });
        return;
      }
      const fieldIds = fieldRefs.map(({docId}) => docId);
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
    addAudioRecording: recording =>
      set({
        audioRecordings: [...get().audioRecordings, recording],
      }),
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
