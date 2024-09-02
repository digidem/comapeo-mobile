import {StateCreator} from 'zustand';
import {createPersistedState} from '../createPersistedState';
import {
  DraftPhoto,
  Photo,
  SavedPhoto,
} from '../../../contexts/PhotoPromiseContext/types';
import {deletePhoto, replaceDraftPhotos} from './photosMethods';
import {ClientGeneratedObservation, Position} from '../../../sharedTypes';
import {Observation, Preset} from '@mapeo/schema';
import {usePresetsQuery} from '../../server/presets';
import {matchPreset} from '../../../lib/utils';
import {LocationObject} from 'expo-location';

const emptyObservation: ClientGeneratedObservation = {
  metadata: {},
  tags: {
    notes: '',
  },
  attachments: [],
};

export type DraftObservationSlice = {
  photos: Photo[];
  audioRecordings: [];
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
    updateObservationPosition: (props: {
      position: Position | LocationObject | undefined;
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

      set({
        value: {
          ...prevValue,
          lon: props?.position?.coords?.longitude,
          lat: props?.position?.coords?.latitude,
          metadata: {
            ...prevValue.metadata,
            position: {
              coords: convertLocationObjectCoordsToPositionCoords(
                props.position?.coords,
              ),
              mocked: !!props.position?.mocked,
              timestamp: props.position?.timestamp?.toString(),
            },
            manualLocation: props.manualLocation,
          },
        },
      });
    },
    existingObservationToDraft: observation => {
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
            tags: tags,
            metadata: {},
            attachments: [],
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

type PositionCoords = NonNullable<Position>['coords'];

function convertLocationObjectCoordsToPositionCoords(
  coords: PositionCoords | LocationObject['coords'] | undefined,
): PositionCoords | undefined {
  if (!coords) {
    return undefined;
  }

  // If it's already a Position, return it as is
  if (
    typeof coords.latitude === 'number' &&
    typeof coords.longitude === 'number'
  ) {
    return coords as PositionCoords;
  }

  // If it's a LocationObject, convert null to undefined
  const converted: PositionCoords = {
    latitude: coords.latitude ?? undefined,
    longitude: coords.longitude ?? undefined,
    altitude: coords.altitude ?? undefined,
    heading: coords.heading ?? undefined,
    speed: coords.speed ?? undefined,
    accuracy: coords.accuracy ?? undefined,
  };

  return converted;
}
