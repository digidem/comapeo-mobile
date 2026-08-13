import {act, renderHook} from '@testing-library/react-native';
import * as React from 'react';
import {type ReactNode} from 'react';
import {createStore} from 'zustand';

import {
  createDraftObservationStore,
  type DraftObservationStore,
  convertPosition,
} from './PersistedStores/DraftObservationStore';
import {
  DraftObservationProvider,
  useDraftObservationState,
  useDraftObservationActions,
} from './DraftObservationContext';
import {type LocationState} from './LocationContext';
import type {Preset} from '@comapeo/schema';
import {PermissionStatus, type LocationObject} from 'expo-location';

// Mock the LocationContext module to provide a test location store
jest.mock('./LocationContext', () => {
  const actual = jest.requireActual('./LocationContext');
  return {
    ...actual,
    useLocationContext: jest.fn(),
  };
});

import {useLocationContext} from './LocationContext';

const mockUseLocationContext = useLocationContext as jest.MockedFunction<
  typeof useLocationContext
>;

function createMockLocationStore() {
  return createStore<LocationState>()(() => ({
    location: undefined,
    throttledMapLocation: undefined,
    locationPermission: PermissionStatus.DENIED,
    providerStatus: {
      locationServicesEnabled: false,
      backgroundModeEnabled: false,
      gpsAvailable: false,
      networkAvailable: false,
      passiveAvailable: false,
    },
  }));
}

function createWrapper(store: DraftObservationStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <DraftObservationProvider draftObservationStore={store}>
        {children}
      </DraftObservationProvider>
    );
  };
}

beforeEach(() => {
  mockUseLocationContext.mockReturnValue(createMockLocationStore());
});

const mockLocationObject: LocationObject = {
  coords: {
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 10.5,
    accuracy: 5.0,
    altitudeAccuracy: 3.0,
    heading: 90,
    speed: 2.5,
  },
  timestamp: Date.now(),
};

const mockPreset: Preset = {
  docId: 'preset-1',
  versionId: 'v1',
  originalVersionId: 'v1',
  schemaName: 'preset',
  name: 'Test Preset',
  geometry: ['point'],
  tags: {category: 'test'},
  addTags: {addedTag: 'added'},
  removeTags: {},
  fieldRefs: [],
  iconRef: undefined,
  color: '#000000',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  links: [],
  deleted: false,
  terms: [],
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('convertPosition()', () => {
  test('converts LocationObject to Position', () => {
    const result = convertPosition(mockLocationObject)!;

    expect(result.coords.latitude).toBe(37.7749);
    expect(result.coords.longitude).toBe(-122.4194);
    expect(result.coords.accuracy).toBe(5.0);
    expect(result.coords.altitude).toBe(10.5);
    expect(result.coords.heading).toBe(90);
    expect(result.coords.speed).toBe(2.5);
    expect(typeof result.timestamp).toBe('string');
  });

  test('converts manual position (without timestamp)', () => {
    const manualPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    };

    const result = convertPosition(manualPosition)!;

    expect(result.coords.latitude).toBe(40.7128);
    expect(result.coords.longitude).toBe(-74.006);
    expect(result.coords.accuracy).toBeUndefined();
    expect(typeof result.timestamp).toBe('string');
  });
});

describe('useDraftObservationState()', () => {
  test('initial state is empty', async () => {
    const store = createDraftObservationStore({persist: false});
    const wrapper = createWrapper(store);

    const stateHook = await renderHook(() => useDraftObservationState(), {
      wrapper,
    });

    expect(stateHook.result.current).toStrictEqual({
      value: null,
      id: null,
      unsavedAttachments: null,
      initialPosition: null,
    });
  });

  test('selector returns specific state slice', async () => {
    const store = createDraftObservationStore({persist: false});
    const wrapper = createWrapper(store);

    const stateHook = await renderHook(
      () => useDraftObservationState(state => state.value),
      {wrapper},
    );

    expect(stateHook.result.current).toBeNull();
  });
});

describe('useDraftObservationActions()', () => {
  describe('createDraft()', () => {
    test('creates empty draft without arguments', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      expect(stateHook.result.current.id).toBeNull();
      expect(stateHook.result.current.unsavedAttachments).toStrictEqual([]);
      expect(stateHook.result.current.value).toStrictEqual({
        schemaName: 'observation',
        metadata: {manualLocation: false},
        tags: {notes: ''},
        attachments: [],
      });
    });

    test('creates draft from existing observation', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      const existingObservation = {
        docId: 'obs-123',
        versionId: 'v1',
        originalVersionId: 'v1',
        schemaName: 'observation' as const,
        lat: 37.7749,
        lon: -122.4194,
        metadata: {manualLocation: false},
        tags: {notes: 'Test observation'},
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        links: [],
        deleted: false,
        createdBy: 'test-device',
      };

      await act(async () => {
        actionsHook.result.current.createDraft(existingObservation);
      });

      expect(stateHook.result.current.id).toStrictEqual({
        docId: 'obs-123',
        versionId: 'v1',
      });
      expect(stateHook.result.current.unsavedAttachments).toStrictEqual([]);
      expect(stateHook.result.current.value?.lat).toBe(37.7749);
      expect(stateHook.result.current.value?.lon).toBe(-122.4194);
      expect(stateHook.result.current.value?.tags.notes).toBe(
        'Test observation',
      );
    });
  });

  describe('clearDraft()', () => {
    test('clears draft and resets to empty state', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      // First create a draft
      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      expect(stateHook.result.current.value).not.toBeNull();

      // Then clear it
      await act(async () => {
        actionsHook.result.current.clearDraft();
      });

      expect(stateHook.result.current).toStrictEqual({
        value: null,
        id: null,
        unsavedAttachments: null,
        initialPosition: null,
      });
    });
  });

  describe('addAudio()', () => {
    test('adds audio attachment to draft', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      const timestamp = Date.now();
      let audioId: number | undefined;

      await act(async () => {
        audioId = actionsHook.result.current.addAudio({
          uri: 'file://audio.m4a',
          duration: 5000,
          createdAt: timestamp,
        });
      });

      expect(audioId).toBe(0);
      expect(stateHook.result.current.unsavedAttachments).toHaveLength(1);
      expect(stateHook.result.current.unsavedAttachments?.[0]).toMatchObject({
        id: 0,
        type: 'audio',
        original: {uri: 'file://audio.m4a', processingState: 'complete'},
        duration: 5000,
        timestamp,
      });
    });

    test('increments attachment id for multiple audio attachments', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      let audioId1: number | undefined;
      let audioId2: number | undefined;

      await act(async () => {
        audioId1 = actionsHook.result.current.addAudio({
          uri: 'file://audio1.m4a',
          duration: 5000,
          createdAt: Date.now(),
        });
        audioId2 = actionsHook.result.current.addAudio({
          uri: 'file://audio2.m4a',
          duration: 3000,
          createdAt: Date.now(),
        });
      });

      expect(audioId1).toBe(0);
      expect(audioId2).toBe(1);
      expect(stateHook.result.current.unsavedAttachments).toHaveLength(2);
    });

    test('throws when adding audio without draft', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });

      expect(() => {
        actionsHook.result.current.addAudio({
          uri: 'file://audio.m4a',
          duration: 5000,
          createdAt: Date.now(),
        });
      }).toThrow('No observation to update');
    });
  });

  describe('deleteUnsavedAttachment()', () => {
    test('removes attachment by id', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
        actionsHook.result.current.addAudio({
          uri: 'file://audio1.m4a',
          duration: 5000,
          createdAt: Date.now(),
        });
        actionsHook.result.current.addAudio({
          uri: 'file://audio2.m4a',
          duration: 3000,
          createdAt: Date.now(),
        });
      });

      expect(stateHook.result.current.unsavedAttachments).toHaveLength(2);

      await act(async () => {
        actionsHook.result.current.deleteUnsavedAttachment(0);
      });

      expect(stateHook.result.current.unsavedAttachments).toHaveLength(1);
      expect(stateHook.result.current.unsavedAttachments?.[0]).toMatchObject({
        id: 1,
        type: 'audio',
      });
    });
  });

  describe('updatePosition()', () => {
    test('updates position with device location', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      await act(async () => {
        actionsHook.result.current.updatePosition({
          manualLocation: false,
          position: mockLocationObject,
        });
      });

      expect(stateHook.result.current.value?.lat).toBe(37.7749);
      expect(stateHook.result.current.value?.lon).toBe(-122.4194);
      expect(stateHook.result.current.value?.metadata?.manualLocation).toBe(
        false,
      );
      expect(
        stateHook.result.current.value?.metadata?.position?.coords.latitude,
      ).toBe(37.7749);
    });

    test('updates position with manual coordinates', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      const manualPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      };

      await act(async () => {
        actionsHook.result.current.updatePosition({
          manualLocation: true,
          position: manualPosition,
        });
      });

      expect(stateHook.result.current.value?.lat).toBe(40.7128);
      expect(stateHook.result.current.value?.lon).toBe(-74.006);
      expect(stateHook.result.current.value?.metadata?.manualLocation).toBe(
        true,
      );
    });

    test('throws when updating position without draft', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });

      expect(() => {
        actionsHook.result.current.updatePosition({
          manualLocation: false,
          position: mockLocationObject,
        });
      }).toThrow('No observation to update');
    });
  });

  describe('updateTag()', () => {
    test('updates a tag value', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      await act(async () => {
        actionsHook.result.current.updateTag('notes', 'My observation notes');
      });

      expect(stateHook.result.current.value?.tags.notes).toBe(
        'My observation notes',
      );
    });

    test('adds new tag', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      await act(async () => {
        actionsHook.result.current.updateTag('customTag', 'custom value');
      });

      expect(stateHook.result.current.value?.tags.customTag).toBe(
        'custom value',
      );
      // Original tag should still exist
      expect(stateHook.result.current.value?.tags.notes).toBe('');
    });

    test('throws when updating tag without draft', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });

      expect(() => {
        actionsHook.result.current.updateTag('notes', 'test');
      }).toThrow('No observation to update');
    });
  });

  describe('updatePreset()', () => {
    test('sets preset on draft without previous preset', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      await act(async () => {
        actionsHook.result.current.updatePreset(mockPreset);
      });

      expect(stateHook.result.current.value?.presetRef).toStrictEqual(
        mockPreset,
      );
      expect(stateHook.result.current.value?.tags.category).toBe('test');
      expect(stateHook.result.current.value?.tags.addedTag).toBe('added');
    });

    test('replaces preset and updates tags correctly', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      // Set first preset
      await act(async () => {
        actionsHook.result.current.updatePreset(mockPreset);
      });

      // Add a custom tag
      await act(async () => {
        actionsHook.result.current.updateTag('myCustomTag', 'should persist');
      });

      const newPreset: Preset = {
        ...mockPreset,
        docId: 'preset-2',
        name: 'New Preset',
        tags: {newCategory: 'new'},
        addTags: {newAddedTag: 'newAdded'},
        removeTags: {},
      };

      // Set new preset
      await act(async () => {
        actionsHook.result.current.updatePreset(newPreset);
      });

      expect(stateHook.result.current.value?.presetRef).toStrictEqual(
        newPreset,
      );
      // New preset tags should be applied
      expect(stateHook.result.current.value?.tags.newCategory).toBe('new');
      expect(stateHook.result.current.value?.tags.newAddedTag).toBe('newAdded');
      // Old preset tags should be removed (they came from the preset)
      expect(stateHook.result.current.value?.tags.category).toBeUndefined();
      expect(stateHook.result.current.value?.tags.addedTag).toBeUndefined();
      // Custom tag should persist
      expect(stateHook.result.current.value?.tags.myCustomTag).toBe(
        'should persist',
      );
    });

    test('removeTags removes specified tags when switching presets', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      await act(async () => {
        actionsHook.result.current.createDraft();
      });

      // First set a preset
      await act(async () => {
        actionsHook.result.current.updatePreset(mockPreset);
      });

      // Add a custom tag (not from preset)
      await act(async () => {
        actionsHook.result.current.updateTag('toRemove', 'removeMe');
      });

      expect(stateHook.result.current.value?.tags.toRemove).toBe('removeMe');

      // Now set a new preset that has removeTags for the custom tag
      const presetWithRemoveTags: Preset = {
        ...mockPreset,
        docId: 'preset-with-remove',
        removeTags: {toRemove: 'removeMe'},
      };

      await act(async () => {
        actionsHook.result.current.updatePreset(presetWithRemoveTags);
      });

      // The custom tag should be removed because it matches removeTags
      expect(stateHook.result.current.value?.tags.toRemove).toBeUndefined();
    });

    test('throws when updating preset without draft', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });

      expect(() => {
        actionsHook.result.current.updatePreset(mockPreset);
      }).toThrow('No observation to update');
    });
  });

  describe('clearDraft() after modifications', () => {
    test('clears all state including attachments', async () => {
      const store = createDraftObservationStore({persist: false});
      const wrapper = createWrapper(store);

      const actionsHook = await renderHook(() => useDraftObservationActions(), {
        wrapper,
      });
      const stateHook = await renderHook(() => useDraftObservationState(), {
        wrapper,
      });

      // Create draft with modifications
      await act(async () => {
        actionsHook.result.current.createDraft();
        actionsHook.result.current.updateTag('notes', 'Some notes');
        actionsHook.result.current.updatePreset(mockPreset);
        actionsHook.result.current.addAudio({
          uri: 'file://audio.m4a',
          duration: 5000,
          createdAt: Date.now(),
        });
        actionsHook.result.current.updatePosition({
          manualLocation: true,
          position: {coords: {latitude: 10, longitude: 20}},
        });
      });

      expect(stateHook.result.current.value).not.toBeNull();
      expect(stateHook.result.current.unsavedAttachments).toHaveLength(1);

      // Clear everything
      await act(async () => {
        actionsHook.result.current.clearDraft();
      });

      expect(stateHook.result.current).toStrictEqual({
        value: null,
        id: null,
        unsavedAttachments: null,
        initialPosition: null,
      });
    });
  });
});
