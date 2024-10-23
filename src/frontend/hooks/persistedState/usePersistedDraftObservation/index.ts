import {StateCreator} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {
  DraftPhoto,
  Photo,
  SavedPhoto,
} from '../../../contexts/PhotoPromiseContext/types';
import {Audio, UnsavedAudio, AudioAttachment} from '../../../sharedTypes/audio';
import {deletePhoto, replaceDraftPhotos} from './photosMethods';
import {ClientGeneratedObservation, Position} from '../../../sharedTypes';
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
  attachments: (Photo | Audio)[];
  value: Observation | null | ClientGeneratedObservation;
  observationId?: string;
  preset?: Preset;
  actions: {
    addPhotoPlaceholder: (draftPhotoId: string) => void;
    replacePhotoPlaceholderWithPhoto: (draftPhoto: DraftPhoto) => void;
    addAudio: (audio: UnsavedAudio) => void;
    deleteAudio: (uri: string) => void;
    // Clear the current draft
    clearDraft: () => void;
    // Create a new draft observation
    newDraft: () => void;
    deletePhoto: (uri: string) => void;
    existingObservationToDraft: (
      observation: Observation,
      preset?: Preset,
    ) => void;
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
  };
};

const draftObservationSlice: StateCreator<DraftObservationSlice> = (
  set,
  get,
) => ({
  attachments: [],
  value: null,
  actions: {
    deletePhoto: uri => deletePhoto(set, get, uri),
    addPhotoPlaceholder: draftPhotoId =>
      set({
        attachments: [
          ...get().attachments,
          {type: 'unprocessed', draftPhotoId},
        ],
      }),
    replacePhotoPlaceholderWithPhoto: draftPhoto =>
      replaceDraftPhotos(set, get, draftPhoto),
    clearDraft: () => {
      set({
        attachments: [],
        value: null,
        observationId: undefined,
        preset: undefined,
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
    existingObservationToDraft: (observation, preset) => {
      const photos = observation.attachments.filter(
        (att): att is SavedPhoto => att.type === 'photo',
      );
      const audios = observation.attachments.filter(
        (att): att is AudioAttachment => att.type === 'audio',
      );

      set({
        value: observation,
        observationId: observation.docId,
        attachments: [...photos, ...audios],
        preset,
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
    updatePreset: preset => {
      const prevValue = get().value;
      const prevPreset = get().preset;
      if (!prevValue) {
        set({
          preset,
          value: {
            ...emptyObservation,
            tags: {
              ...preset.tags,
              ...preset.addTags,
            },
          },
        });
        return;
      }
      if (!prevPreset) {
        set({
          preset,
          value: {
            ...prevValue,
            tags: {
              ...prevValue.tags,
              ...preset.tags,
              ...preset.addTags,
            },
          },
        });
        return;
      }
      // Apply tags from new preset and remove tags from previous preset
      const newTags: Observation['tags'] = {...preset.tags, ...preset.addTags};
      for (const [key, value] of Object.entries(prevValue.tags)) {
        const tagWasFromPrevPreset =
          prevPreset.tags[key] === value || prevPreset.addTags[key] === value;
        const shouldRemoveTag = preset.removeTags[key] === value;
        // Only keep tags that were not from the previous preset and are not removed by the new preset
        if (!tagWasFromPrevPreset && !shouldRemoveTag) {
          newTags[key] = value;
        }
      }

      set({
        preset,
        value: {
          ...prevValue,
          tags: newTags,
        },
      });
    },
    addAudio: (audio: UnsavedAudio) => {
      set({attachments: [...get().attachments, audio]});
    },
    deleteAudio: (uri: string) => {
      const extractedName = uri.split('/').pop();
      const updatedAttachments = get().attachments.map(attachment => {
        if ('name' in attachment && attachment.name === extractedName) {
          return {...attachment, deleted: true};
        }
        return attachment;
      });
      set({attachments: updatedAttachments});
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
  const preset = usePersistedDraftObservation(store => store.preset);
  // For a draft observation (in contrast to an existing observation), we
  // prioritize the preset explicitly set on the draft, rather than the one that
  // we match based on tags.
  if (preset) {
    return preset;
  } else if (tags) {
    return matchPreset(tags, presets);
  }
};

export const _usePersistedDraftObservationActions = () =>
  usePersistedDraftObservation(state => state.actions);
