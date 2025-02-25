import * as React from 'react';
import {act, renderHook} from '@testing-library/react-native';
import {
  DraftObservationProvider,
  useDraftObservationActions,
  useDraftObservationState,
} from './DraftObservationContext';
import {
  convertPosition,
  createDraftObservationStore,
  DraftObservationStore,
  DraftStateEmpty,
  ObservationWithPreset,
  valueOf,
} from './PersistedStores/DraftObservationStore';
import {Preset} from '@comapeo/schema';
import {LocationObject} from 'expo-location';

function Wrapper({
  children,
  draftObservationStore,
}: {
  children: React.ReactNode;
  draftObservationStore: DraftObservationStore;
}) {
  return (
    <DraftObservationProvider draftObservationStore={draftObservationStore}>
      {children}
    </DraftObservationProvider>
  );
}

const EMPTY_DRAFT_OBSERVATION: DraftStateEmpty = {
  value: null,
  id: null,
  unsavedAttachments: null,
  initialPosition: null,
};

describe('DraftObservation actions', () => {
  test('creates a draft and clears a draft', () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    // Initial check: state should be empty
    expect(result.current.state).toEqual(EMPTY_DRAFT_OBSERVATION);

    // Creating a draft
    act(() => {
      result.current.actions.createDraft();
    });

    // Check: state should be updated after creating a draft
    expect(result.current.state).not.toEqual(EMPTY_DRAFT_OBSERVATION);

    // Clearing the draft
    act(() => {
      result.current.actions.clearDraft();
    });

    // Final check: state should be empty again
    expect(result.current.state).toEqual(EMPTY_DRAFT_OBSERVATION);
  });

  test('creates a draft observation from an existing observation', () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    act(() => {
      result.current.actions.createDraft(testObservationWithPreset);
    });

    expect(result.current.state.id?.docId).toEqual(
      testObservationWithPreset.docId,
    );

    expect(result.current.state.id?.versionId).toEqual(
      testObservationWithPreset.versionId,
    );

    expect(result.current.state.value).toEqual(
      valueOf(testObservationWithPreset),
    );

    expect(result.current.state.unsavedAttachments?.size).toEqual(0);

    expect(result.current.state.initialPosition).toBeNull();
  });

  test('throws error when action is attempted on a draft that has not been instantiated', async () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    // Testing all actions when no draft is created
    expect(() => result.current.actions.addAudio('test audio')).toThrow();
    expect(() => result.current.actions.deleteUnsavedAttachment(1)).toThrow();
    expect(() =>
      result.current.actions.updatePosition({
        manualLocation: true,
        position: {coords: {latitude: 1, longitude: 1}},
      }),
    ).toThrow();
    expect(() => result.current.actions.updateTag('name', 'test')).toThrow();
    expect(() => result.current.actions.updatePreset(testPreset)).toThrow();

    // Testing async action
    await expect(() =>
      result.current.actions.addPhoto(createFakeImage(), {
        timestamp: 0,
      }),
    ).rejects.toThrow();
  });

  test('adds and deletes an audio attachment', () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    // Create a draft and add an audio attachment
    act(() => {
      result.current.actions.createDraft();
      result.current.actions.addAudio('test audio');
    });

    // Check: size of unsavedAttachments should be 1
    expect(result.current.state.unsavedAttachments?.size).toEqual(1);

    // Delete the attachment
    act(() => {
      result.current.actions.deleteUnsavedAttachment(0);
    });

    // Check: size of unsavedAttachments should be 0
    expect(result.current.state.unsavedAttachments?.size).toEqual(0);
  });

  test('adds and modifies tags', () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    // Create a draft and add a tag
    act(() => {
      result.current.actions.createDraft();
      result.current.actions.updateTag('name', 'test');
    });

    expect(result.current.state.value?.tags).toEqual(
      expect.objectContaining({name: 'test'}),
    );

    // Modify the tag
    act(() => {
      result.current.actions.updateTag('name', 'modified');
    });

    expect(result.current.state.value?.tags).toEqual(
      expect.objectContaining({name: 'modified'}),
    );
  });

  test('updates a preset', () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    //creates draft
    act(() => {
      result.current.actions.createDraft();
    });

    //checks that preset is undefined
    expect(result.current.state.value?.presetRef).toBeUndefined();

    //updates preset
    act(() => {
      result.current.actions.updatePreset(testPreset);
    });

    //checks that preset is updated
    expect(result.current.state.value?.presetRef).toEqual(testPreset);
  });

  test('updates position', () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    //creates draft
    act(() => {
      result.current.actions.createDraft();
    });

    //adds position
    act(() => {
      result.current.actions.updatePosition({
        position: testLocationObject,
        manualLocation: false,
      });
    });

    //checks that lat is updated
    expect(result.current.state.value?.lat).toEqual(
      testLocationObject.coords.latitude,
    );

    //checks that lon is updated
    expect(result.current.state.value?.lon).toEqual(
      testLocationObject.coords.longitude,
    );

    //check that manualLocation is false
    expect(result.current.state.value?.metadata?.manualLocation).toEqual(false);

    //check that metadata.postion is updated
    expect(result.current.state.value?.metadata?.position).toEqual(
      convertPosition(testLocationObject),
    );

    const manualPosition = {coords: {latitude: 1, longitude: 1}};

    //overwrite position with manual location
    act(() => {
      result.current.actions.updatePosition({
        position: manualPosition,
        manualLocation: true,
      });
    });

    //check that manualLocation is true
    expect(result.current.state.value?.metadata?.manualLocation).toEqual(true);

    //checks that lat is updated
    expect(result.current.state.value?.lat).toEqual(
      manualPosition.coords.latitude,
    );

    //checks that lon is updated
    expect(result.current.state.value?.lon).toEqual(
      manualPosition.coords.longitude,
    );
  });

  test('adds and deletes photos', async () => {
    const testStore = createDraftObservationStore({persist: false});
    const {result} = renderHook(
      () => ({
        state: useDraftObservationState(),
        actions: useDraftObservationActions(),
      }),
      {
        wrapper: ({children}) => (
          <Wrapper draftObservationStore={testStore}>{children}</Wrapper>
        ),
      },
    );

    //creates draft
    act(() => {
      result.current.actions.createDraft();
    });

    //adds photo
    await act(async () => {
      await result.current.actions.addPhoto(createFakeImage(), {
        timestamp: 0,
      });
    });

    //checks that there is an unsaved attachment
    expect(result.current.state.unsavedAttachments?.size).toEqual(1);

    // Delete the attachment
    act(() => {
      result.current.actions.deleteUnsavedAttachment(0);
    });

    // Check: size of unsavedAttachments should be 0
    expect(result.current.state.unsavedAttachments?.size).toEqual(0);
  });
});

function createFakeImage(): Promise<{
  width: number;
  height: number;
  uri: string;
}> {
  return Promise.resolve({
    width: 1920,
    height: 1080,
    uri: 'https://example.com/image.jpg',
  });
}

const testObservationWithPreset: ObservationWithPreset = {
  schemaName: 'observation',
  docId: 'obs123',
  versionId: 'obs123/1',
  originalVersionId: 'obs123/1',
  createdAt: '2024-02-19T10:00:00Z',
  updatedAt: '2024-02-20T12:34:56Z',
  links: ['obs122/1'],
  deleted: false,
  lat: 37.7749,
  lon: -122.4194,
  attachments: [
    {
      driveDiscoveryId: '123abc',
      name: 'photo1.jpg',
      type: 'photo',
      hash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
  ],
  tags: {
    category: 'wildlife',
    confidence: 0.95,
    verified: true,
    comments: ['Great find!', 'Needs verification'],
  },
  metadata: {
    manualLocation: true,
    position: {
      timestamp: '2024-02-20T12:34:56Z',
      mocked: false,
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 10,
        accuracy: 5,
      },
    },
  },
  presetRef: {
    schemaName: 'preset',
    docId: 'preset123',
    versionId: 'preset123/1',
    originalVersionId: 'preset123/1',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-02-20T10:45:00Z',
    links: ['preset122/1'],
    deleted: false,
    name: 'Tree',
    geometry: ['point'],
    tags: {
      nature: 'tree',
      species: 'oak',
    },
    addTags: {
      nature: 'tree',
      species: 'oak',
    },
    removeTags: {
      nature: 'tree',
    },
    fieldRefs: [
      {
        docId: 'field123',
        versionId: 'field123/1',
      },
    ],
    iconRef: {
      docId: 'icon456',
      versionId: 'icon456/1',
    },
    terms: ['oak', 'tree', 'plant'],
    color: '#228B22',
  },
};

const testPreset: Preset = {
  schemaName: 'preset',
  name: 'Test Feature',
  geometry: ['point', 'area'],
  tags: {
    type: 'landmark',
    importance: 5,
    accessible: true,
    notes: ['historical site', 'tourist attraction'],
  },
  addTags: {
    verified: true,
  },
  removeTags: {
    outdated: true,
  },
  fieldRefs: [
    {
      docId: 'abcdef1234567890',
      versionId: '1234567890abcdef/1',
    },
  ],
  iconRef: {
    docId: 'icon1234567890',
    versionId: 'abcdef1234567890/2',
  },
  terms: ['monument', 'heritage', 'statue'],
  color: '#ffcc00',
  docId: 'preset1234567890',
  versionId: 'abcdef0987654321/3',
  originalVersionId: 'abcdef0987654321/3',
  createdAt: '2024-02-20T12:00:00Z',
  updatedAt: '2024-02-20T12:30:00Z',
  links: ['prevVersion123456/1', 'prevVersion123457/2'],
  deleted: false,
};

const testLocationObject: LocationObject = {
  coords: {
    latitude: 48.8588443,
    longitude: 2.2943506,
    altitude: 35.0,
    accuracy: 10.0,
    altitudeAccuracy: 5.0,
    heading: 0,
    speed: 3.5,
  },
  timestamp: 1675945086000,
  mocked: false,
};
