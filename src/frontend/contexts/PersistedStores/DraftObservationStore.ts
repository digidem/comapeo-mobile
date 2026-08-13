import {
  type MapeoDoc,
  type Observation,
  type ObservationValue,
  type Preset,
} from '@comapeo/schema';
import {createStore, type StoreApi} from 'zustand';
import {
  persist as createPersistedState,
  createJSONStorage,
} from 'zustand/middleware';
import type {LocationObject, LocationProviderStatus} from 'expo-location';
import type {AccelerometerMeasurement} from 'expo-sensors';
import {manipulateAsync} from 'expo-image-manipulator';
import {excludeKeys} from 'filter-obj';
import type {Attachment, Position} from '../../sharedTypes/index.ts';
import {throwIfAborted} from '../../lib/throwIfAborted.ts';
import {parse} from 'valibot';
import {PhotoEXIFSchema} from '../../lib/exif.ts';
import * as Sentry from '@sentry/react-native';
import {MMKVStoreInitializer} from '../../hooks/persistedState/createPersistedState';
import type {PhotoFile} from 'react-native-vision-camera';
import * as Exify from '@lodev09/react-native-exify';

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
  // Abort controller cannot be serialized, and thereofore cannot be saved to persisted state
  // We create an abortController in memory which allows us to abort photos being processed
  const abortControllers = new Map<number, AbortController>();
  let instance: StoreApi<DraftState>;

  if (persist) {
    instance = createStore<DraftState>()(
      createPersistedState(createEmptyStoreState as () => DraftState, {
        name: '@MapeoDraftStore',
        storage: createJSONStorage(() => MMKVStoreInitializer),
        version: 0,
        onRehydrateStorage: () => state => {
          if (!state?.unsavedAttachments) return;

          for (const attachment of state.unsavedAttachments) {
            // Initialize nextAttachmentId to be higher than any existing ID
            // to prevent duplicate IDs when adding new attachments
            if (attachment.id >= nextAttachmentId) {
              nextAttachmentId = attachment.id + 1;
            }
            if (
              attachment.type === 'photo' &&
              hasIncompleteProcessing(attachment)
            ) {
              processPhoto(attachment);
            }
          }
        },
      }),
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
        unsavedAttachments: [...prev.unsavedAttachments, attachment],
      };
    });
  }

  function _updateAttachment<T extends 'photo' | 'audio'>(
    type: T,
    id: number,
    partial: Partial<Extract<UnsavedAttachment, {type: T}>>,
  ): void {
    setAssertDraft(prev => {
      const updatedAttachments = prev.unsavedAttachments.map(att => {
        if (att.id === id) {
          if (att.type !== type) {
            throw new Error(`Attachment with id ${id} is not of type ${type}`);
          }
          return {...att, ...partial};
        }
        return att;
      });

      return {
        unsavedAttachments: updatedAttachments,
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

  /**
   * Process a photo attachment: rotate original, create thumbnail and preview.
   * Can be called on initial capture or to restart interrupted processing.
   * Only processes steps that are not already complete.
   */
  async function processPhoto(attachment: UnsavedPhotoAttachment) {
    const {id, raw, original, thumbnail, preview} = attachment;

    if (raw.processingState !== 'complete' || !raw.uri) {
      throw new Error('Cannot process photo without raw image');
    }

    const controller = new AbortController();
    abortControllers.set(id, controller);
    const {signal} = controller;

    // The photos could be have to be processed more than once (eg, the user closes the app mid process).
    // So we want to check if they have already been processed and COMPLETED before re-processing it
    try {
      // Get or create the original (rotated) image
      let originalUri: string;
      let width: number;
      let height: number;

      if (original.processingState === 'complete' && original.uri) {
        // Original already processed, use existing URI
        // We need dimensions for thumbnail/preview, so fetch from the image
        const result = await manipulateAsync(original.uri, []);
        originalUri = result.uri;
        width = result.width;
        height = result.height;
      } else {
        // Note: Expo Camera with skipProcessing: false automatically rotates photos
        // to the correct orientation; no further rotation needed.
        const result = await _processPhotoAttachment({
          id,
          outputKey: 'original',
          processPromise: manipulateAsync(raw.uri, [{rotate: 0}], {
            compress: ORIGINAL_COMPRESSION,
          }),
        });
        originalUri = result.uri;
        width = result.width;
        height = result.height;
      }
      throwIfAborted(signal);

      if (thumbnail.processingState !== 'complete') {
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
        throwIfAborted(signal);
      }

      if (preview.processingState !== 'complete') {
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
        throwIfAborted(signal);
      }
    } catch (reason) {
      Sentry.captureException(reason);
    } finally {
      abortControllers.delete(id);
    }
  }

  async function addPhoto(picture: PhotoFile, metadata: PhotoMetadata) {
    const newAttachment = await createNewPhotoAttachment({
      id: nextAttachmentId++,
      metadata,
      picture,
    });
    _addAttachment(newAttachment);
    await processPhoto(newAttachment);
  }

  /**
   *
   * @returns audio attachment ID
   */
  function addAudio({
    uri,
    duration,
    createdAt,
  }: {
    uri: string;
    duration: number;
    createdAt: number;
  }) {
    const newAttachment: UnsavedAudioAttachment = {
      id: nextAttachmentId++,
      type: 'audio',
      original: {uri, processingState: 'complete'},
      timestamp: createdAt,
      duration,
    };
    _addAttachment(newAttachment);
    return newAttachment.id;
  }

  function deleteUnsavedAttachment(id: number) {
    abortControllers.get(id)?.abort();
    abortControllers.delete(id);
    setAssertDraft(prev => {
      const newAttachments = prev.unsavedAttachments.filter(a => a.id !== id);
      return {unsavedAttachments: newAttachments};
    });
  }

  function clearDraft() {
    abortControllers.forEach(controller => controller.abort());
    abortControllers.clear();
    instance.setState(createEmptyStoreState(), true);
  }

  function createDraft(observation?: ObservationWithPreset) {
    if (observation) {
      instance.setState(
        {
          value: valueOf(observation),
          id: {docId: observation.docId, versionId: observation.versionId},
          unsavedAttachments: [],
          initialPosition: null,
        },
        true,
      );
    } else {
      instance.setState(
        {
          value: createEmptyObservationValue(),
          id: null,
          unsavedAttachments: [],
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

export type UnsavedAttachmentBlob =
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

export type UnsavedPhotoAttachment = {
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
  photoExif?: Extract<Attachment, {type: 'photo'}>['photoExif'];
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

export type UnsavedAudioAttachment = {
  id: number;
  original: UnsavedAttachmentBlob;
  type: 'audio';
  timestamp: number;
  duration: number;
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
  unsavedAttachments: UnsavedAttachment[];
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
    metadata: {manualLocation: false},
    tags: {
      notes: '',
    },
    attachments: [],
  };
}

async function createNewPhotoAttachment({
  id,
  metadata,
  picture,
}: {
  id: number;
  metadata: PhotoMetadata;
  picture: PhotoFile;
}): Promise<UnsavedPhotoAttachment> {
  const uri = `file://${picture.path}`;
  const exif = await Exify.read(uri);
  return {
    id,
    type: 'photo',
    raw: {uri, processingState: 'complete'},
    original: {uri: null, processingState: 'pending'},
    thumbnail: {uri: null, processingState: 'pending'},
    preview: {uri: null, processingState: 'pending'},
    photoExif: exif
      ? parse(PhotoEXIFSchema, {
          ...exif,
          ISOSpeedRatings: Array.isArray(exif.ISOSpeedRatings)
            ? exif.ISOSpeedRatings[0]
            : exif.ISOSpeedRatings,
        })
      : undefined,
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

function hasIncompleteProcessing(attachment: UnsavedPhotoAttachment): boolean {
  return (
    attachment.original.processingState !== 'complete' ||
    attachment.thumbnail.processingState !== 'complete' ||
    attachment.preview.processingState !== 'complete'
  );
}
