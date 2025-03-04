import {
  type MapeoDoc,
  type Observation,
  type ObservationValue,
  type Preset,
} from '@comapeo/schema';
import {createStore, type StoreApi} from 'zustand';
import {persist as createPersistedState} from 'zustand/middleware';
import type {LocationObject, LocationProviderStatus} from 'expo-location';
import type {AccelerometerMeasurement} from 'expo-sensors';
import type {CameraCapturedPicture} from 'expo-camera';
import {manipulateAsync} from 'expo-image-manipulator';
import {excludeKeys} from 'filter-obj';
import type {Position} from '../../sharedTypes/index.ts';

export type DraftObservationStore = ReturnType<
  typeof createDraftObservationStore
>;

export type DraftState = DraftStateEmpty | DraftStatePopulated;

export function convertPosition(
  location: LocationObject | ManualPosition,
): Position {
  const {coords} = location;
  return {
    coords: {
      latitude: coords.latitude,
      longitude: coords.longitude,
      // @ts-expect-error - too much work to fix this, not a runtime issue
      accuracy: coords.accuracy ?? undefined,
      // @ts-expect-error - too much work to fix this, not a runtime issue
      altitude: coords.altitude ?? undefined,
      // @ts-expect-error - too much work to fix this, not a runtime issue
      heading: coords.heading ?? undefined,
      // @ts-expect-error - too much work to fix this, not a runtime issue
      speed: coords.speed ?? undefined,
    },
    timestamp:
      'timestamp' in location
        ? new Date(location.timestamp).toISOString()
        : new Date().toISOString(),
  };
}

export function createDraftObservationStore({persist}: {persist: boolean}) {
  let nextAttachmentId = 0;
  let instance: StoreApi<DraftState>;

  if (persist) {
    instance = createStore(
      createPersistedState(createEmptyStoreState, {name: '@MapeoDraft'}),
    );
  } else {
    instance = createStore(createEmptyStoreState);
  }

  /** Helper to set state, but throw if store is empty (no draft observation) */
  function setAssertDraft(
    partial: (state: DraftStatePopulated) => Partial<DraftStatePopulated>,
  ): void {
    return instance.setState(prev => {
      if (prev.value === null) {
        throw new Error('No observation to update');
      }
      return partial(prev);
    });
  }

  function _addAttachment(attachment: UnsavedAttachment): void {
    setAssertDraft(prev => {
      return {
        unsavedAttachments: new Map(prev.unsavedAttachments).set(
          attachment.id,
          attachment,
        ),
      };
    });
  }

  function _updateAttachment<T extends 'photo' | 'audio'>(
    type: T,
    id: number,
    partial: Partial<Extract<UnsavedAttachment, {type: T}>>,
  ): void {
    setAssertDraft(prev => {
      const attachment = prev.unsavedAttachments.get(id);
      if (!attachment) return prev;
      if (attachment.type !== type) {
        throw new Error(`Attachment with id ${id} is not of type ${type}`);
      }

      return {
        unsavedAttachments: new Map(prev.unsavedAttachments).set(id, {
          ...attachment,
          ...partial,
        }),
      };
    });
  }

  async function _processPhotoAttachment<T extends {uri: string}>({
    id,
    outputKey,
    processPromise,
  }: {
    id: number;
    outputKey: 'thumbnail' | 'preview' | 'original' | 'raw';
    processPromise: Promise<T>;
  }): Promise<T> {
    try {
      const processResult = await processPromise;
      _updateAttachment('photo', id, {
        [outputKey]: {uri: processResult.uri, processingState: 'complete'},
      });
      return processResult;
    } catch (reason) {
      const error = reasonToError(reason);
      _updateAttachment('photo', id, {
        [outputKey]: {uri: null, processingState: 'error', error},
      });
      throw reason;
    }
  }

  function addPhoto(
    capturePromise: Promise<CameraCapturedPicture>,
    metadata: PhotoMetadata,
  ) {
    const newAttachment = createNewPhotoAttachment(
      nextAttachmentId++,
      metadata,
    );
    const {
      abortController: {signal},
      id,
    } = newAttachment;
    // This should happen before any async code, so that any error is synchronous
    _addAttachment(newAttachment);

    // Return a promise that resolves when the photo has been processed (since
    // we don't use this, we could just return void instead)
    return (async () => {
      const {uri: rawUri} = await _processPhotoAttachment({
        id,
        outputKey: 'raw',
        processPromise: capturePromise,
      });
      signal.throwIfAborted();

      // TODO: Previously, rotation of the original photo could fail on older
      // devices with low memory, so we would skip rotation and save the raw
      // image as the original, and then rotate the preview and thumbnail, which
      // would work. However hopefully the expo image manipulator does not fail
      // in the same way, so we will not need that workaround. If we do get
      // failures reported, then we should consider adding it back in.
      const {
        uri: originalUri,
        width,
        height,
      } = await _processPhotoAttachment({
        id,
        outputKey: 'original',
        processPromise: manipulateAsync(
          rawUri,
          [{rotate: getPhotoRotation(metadata.accelerometer)}],
          {compress: ORIGINAL_COMPRESSION},
        ),
      });
      signal.throwIfAborted();

      const thumbnailDimensions =
        width > height ? {width: THUMBNAIL_SIZE} : {height: THUMBNAIL_SIZE};
      await _processPhotoAttachment({
        id,
        outputKey: 'thumbnail',
        processPromise: manipulateAsync(
          originalUri,
          [{resize: thumbnailDimensions}],
          {compress: THUMBNAIL_COMPRESSION},
        ),
      });
      signal.throwIfAborted();

      const previewDimensions =
        width > height ? {width: PREVIEW_SIZE} : {height: PREVIEW_SIZE};
      await _processPhotoAttachment({
        id,
        outputKey: 'preview',
        processPromise: manipulateAsync(
          originalUri,
          [{resize: previewDimensions}],
          {compress: PREVIEW_COMPRESSION},
        ),
      });
      signal.throwIfAborted();
    })().catch(reason => {
      if (reason instanceof Error && reason.name === 'AbortError') {
        // TODO: Remove attachment from state
      }
      // TODO: Report other errors to Sentry
    });
  }

  function addAudio(uri: string) {
    const newAttachment: UnsavedAudioAttachment = {
      id: nextAttachmentId++,
      type: 'audio',
      original: {uri, processingState: 'complete'},
      abortController: new AbortController(),
    };
    _addAttachment(newAttachment);
  }

  function deleteUnsavedAttachment(id: number) {
    setAssertDraft(prev => {
      if (!prev.unsavedAttachments.has(id)) return prev;
      const attachments = new Map(prev.unsavedAttachments);
      attachments.delete(id);
      return {unsavedAttachments: attachments};
    });
  }

  function clearDraft() {
    instance.setState(createEmptyStoreState(), true);
  }

  function createDraft(observation?: ObservationWithPreset) {
    if (observation) {
      instance.setState(
        {
          value: valueOf(observation),
          id: {docId: observation.docId, versionId: observation.versionId},
          unsavedAttachments: new Map(),
          initialPosition: null,
        },
        true,
      );
    } else {
      instance.setState(
        {
          value: createEmptyObservationValue(),
          id: null,
          unsavedAttachments: new Map(),
          initialPosition: null,
        },
        true,
      );
    }
  }

  function updatePosition(
    opts:
      | {
          manualLocation: false;
          position: LocationObject;
          // TODO: Optional for now until we integrate this into the draft observation location updater
          positionProvider?: LocationProviderStatus;
        }
      | {
          manualLocation: true;
          position: ManualPosition;
        },
  ) {
    const {position, ...rest} = opts;
    const metadata: ObservationValue['metadata'] = {
      ...rest,
      position: convertPosition(position),
    };
    setAssertDraft(prev => {
      // Forward compat - make sure we keep any other metadata that we don't know about
      const prevMetadataToKeep = excludeKeys(prev.value.metadata || {}, [
        'manualLocation',
        'position',
        'positionProvider',
      ]);
      return {
        value: {
          ...prev.value,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          metadata: {
            ...prevMetadataToKeep,
            ...metadata,
          },
        },
      };
    });
  }

  function updateTag(tagKey: string, value: ObservationTagValue): void {
    setAssertDraft(prev => {
      return {
        value: {
          ...prev.value,
          tags: {...prev.value.tags, [tagKey]: value},
        },
      };
    });
  }

  function updatePreset(preset: Preset) {
    setAssertDraft(prev => {
      const prevPreset = prev.value.presetRef;
      if (!prevPreset) {
        return {
          value: {
            ...prev.value,
            presetRef: preset,
            tags: {
              ...prev.value.tags,
              ...preset.tags,
              ...preset.addTags,
            },
          },
        };
      }
      // Apply tags from new preset and remove tags from previous preset
      const newTags: Observation['tags'] = {...preset.tags, ...preset.addTags};
      for (const [key, value] of Object.entries(prev.value.tags)) {
        const tagWasFromPrevPreset =
          prevPreset.tags[key] === value || prevPreset.addTags[key] === value;
        const shouldRemoveTag = preset.removeTags[key] === value;
        // Only keep tags that were not from the previous preset and are not removed by the new preset
        if (!tagWasFromPrevPreset && !shouldRemoveTag) {
          newTags[key] = value;
        }
      }

      return {
        value: {
          ...prev.value,
          presetRef: preset,
          tags: newTags,
        },
      };
    });
  }

  const actions = {
    addPhoto,
    addAudio,
    deleteUnsavedAttachment,
    clearDraft,
    createDraft,
    updatePosition,
    updateTag,
    updatePreset,
  };

  return {instance, actions};
}

type ObservationTagValue = Observation['tags'][number];

type UnsavedAttachmentBlob =
  | {
      uri: string;
      processingState: 'complete';
    }
  | {
      uri: null;
      processingState: 'pending';
    }
  | {
      uri: null;
      error: Error;
      processingState: 'error';
    };

type UnsavedPhotoAttachment = {
  id: number;
  type: 'photo';
  // Represents unprocessed blob (i.e. not resized or rotated)
  raw: UnsavedAttachmentBlob;
  original: UnsavedAttachmentBlob;
  thumbnail: UnsavedAttachmentBlob;
  preview: UnsavedAttachmentBlob;
  accelerometer?: AccelerometerMeasurement;
  location?: LocationObject;
  timestamp: number;
  abortController: AbortController;
};

export type PhotoMetadata = Pick<
  UnsavedPhotoAttachment,
  'location' | 'accelerometer' | 'timestamp'
>;

/** Position update from manual coordinate entry */
type ManualPosition = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type UnsavedAudioAttachment = {
  id: number;
  original: UnsavedAttachmentBlob;
  type: 'audio';
  abortController: AbortController;
};

type UnsavedAttachment = UnsavedPhotoAttachment | UnsavedAudioAttachment;

type DraftStateEmpty = {
  value: null;
  id: null;
  unsavedAttachments: null;
  initialPosition: null;
};

type ObservationWithPreset = Exclude<Observation, 'presetRef'> & {
  presetRef?: Preset;
};

type ObservationValueWithPreset = Exclude<ObservationValue, 'presetRef'> & {
  presetRef?: Preset;
};

type DraftStatePopulated = {
  value: ObservationValueWithPreset;
  id: {docId: string; versionId: string} | null;
  unsavedAttachments: Map<number, UnsavedAttachment>;
  /** Initial (first) position of an observation. Not currently persisted, but
   * used for checking if the user moves away from the original location */
  initialPosition: Position | null;
};

const ORIGINAL_COMPRESSION = 0.75;
const THUMBNAIL_SIZE = 400;
const THUMBNAIL_COMPRESSION = 0.3;
const PREVIEW_SIZE = 1200;
const PREVIEW_COMPRESSION = 0.3;

function createEmptyStoreState(): DraftStateEmpty {
  return {
    value: null,
    id: null,
    unsavedAttachments: null,
    initialPosition: null,
  };
}

function createEmptyObservationValue(): ObservationValueWithPreset {
  return {
    schemaName: 'observation',
    lat: 0,
    lon: 0,
    metadata: {manualLocation: false},
    tags: {
      notes: '',
    },
    attachments: [],
  };
}

function createNewPhotoAttachment(
  id: number,
  metadata: PhotoMetadata,
): UnsavedAttachment {
  return {
    id,
    type: 'photo',
    raw: {uri: null, processingState: 'pending'},
    original: {uri: null, processingState: 'pending'},
    thumbnail: {uri: null, processingState: 'pending'},
    preview: {uri: null, processingState: 'pending'},
    abortController: new AbortController(),
    ...metadata,
  };
}

function reasonToError(reason: unknown): Error {
  if (reason instanceof Error) {
    return reason;
  }
  if (typeof reason === 'string') {
    return new Error(reason);
  }
  return new Error('Unknown error');
}

const ACC_AT_45_DEG = Math.sin(Math.PI / 4);

function getPhotoRotation(acc?: AccelerometerMeasurement) {
  if (!acc) return 0;
  const {x, y, z} = acc;
  let rotation = 0;
  if (z < -ACC_AT_45_DEG || z > ACC_AT_45_DEG) {
    // camera is pointing up or down
    if (Math.abs(y) > Math.abs(x)) {
      // camera is vertical
      if (y <= 0) rotation = 180;
      else rotation = 0;
    } else {
      // camera is horizontal
      if (x >= 0) rotation = -90;
      else rotation = 90;
    }
  } else if (x > -ACC_AT_45_DEG && x < ACC_AT_45_DEG) {
    // camera is vertical
    if (y <= 0) rotation = 180;
    else rotation = 0;
  } else {
    // camera is horizontal
    if (x >= 0) rotation = -90;
    else rotation = 90;
  }
  return rotation;
}

// TODO: Move this to @mapeo/schema - the current version is not flexible enough
function valueOf<T extends MapeoDoc>(doc: T & {forks?: string[]}) {
  return excludeKeys(doc, [
    'docId',
    'versionId',
    'originalVersionId',
    'links',
    'forks',
    'createdAt',
    'updatedAt',
    'deleted',
  ]);
}
