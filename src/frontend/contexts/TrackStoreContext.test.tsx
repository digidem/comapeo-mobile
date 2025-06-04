import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createTrackStore,
  type TrackStore,
  TrackStoreProvider,
  useTrackActions,
  useTrackState,
} from './TrackStoreContext';

function createWrapper(trackStore: TrackStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <TrackStoreProvider value={trackStore}>{children}</TrackStoreProvider>
    );
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useTrackState()', () => {
  test('initial state', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const stateHook = renderHook(() => useTrackState(), {
      wrapper,
    });

    expect(stateHook.result.current).toStrictEqual({
      description: '',
      locationHistory: [],
      observationRefs: [],
      startTime: null,
    });
  });
});

describe('useTrackActions()', () => {
  test('initializeTrackTime()', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);
    const dateSpy = jest.spyOn(global, 'Date');

    const actionsHook = renderHook(() => useTrackActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useTrackState(), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.initializeTrackTime();
    });

    expect(stateHook.result.current).toStrictEqual({
      description: '',
      locationHistory: [],
      observationRefs: [],
      startTime: dateSpy.mock.instances.at(-1),
    });
  });
  test('addNewObservation()', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const actionsHook = renderHook(() => useTrackActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useTrackState(), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.addNewObservation({
        docId: 'doc_1',
        versionId: 'version_1',
      });
    });

    expect(stateHook.result.current).toStrictEqual({
      description: '',
      locationHistory: [],
      observationRefs: [{docId: 'doc_1', versionId: 'version_1'}],
      startTime: null,
    });
  });

  test('clearCurrentTrack()', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const actionsHook = renderHook(() => useTrackActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useTrackState(), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.setDescription('some description');
    });

    expect(stateHook.result.current).toStrictEqual({
      description: 'some description',
      locationHistory: [],
      observationRefs: [],
      startTime: null,
    });

    act(() => {
      actionsHook.result.current.clearCurrentTrack();
    });

    expect(stateHook.result.current).toStrictEqual({
      description: '',
      locationHistory: [],
      observationRefs: [],
      startTime: null,
    });
  });

  test('setDescription()', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const actionsHook = renderHook(() => useTrackActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useTrackState(), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.setDescription('some description');
    });

    expect(stateHook.result.current).toStrictEqual({
      description: 'some description',
      locationHistory: [],
      observationRefs: [],
      startTime: null,
    });
  });

  test('addNewLocations()', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const actionsHook = renderHook(() => useTrackActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useTrackState(), {
      wrapper,
    });

    const timestamp1 = Date.now();
    const timestamp2 = timestamp1 + 1_000;

    act(() => {
      actionsHook.result.current.addNewLocations([
        {latitude: 0, longitude: 0, timestamp: timestamp1},
        {latitude: 1, longitude: 1, timestamp: timestamp2},
      ]);
    });

    expect(stateHook.result.current).toMatchObject({
      description: '',
      locationHistory: [
        {latitude: 0, longitude: 0, timestamp: timestamp1},
        {latitude: 1, longitude: 1, timestamp: timestamp2},
      ],
      observationRefs: [],
      startTime: null,
    });

    const timestamp3 = timestamp2 + 1_000;

    act(() => {
      actionsHook.result.current.addNewLocations([
        {latitude: 0.5, longitude: 0.5, timestamp: timestamp3},
      ]);
    });

    expect(stateHook.result.current).toMatchObject({
      description: '',
      locationHistory: [
        {latitude: 0, longitude: 0, timestamp: timestamp1},
        {latitude: 1, longitude: 1, timestamp: timestamp2},
        {latitude: 0.5, longitude: 0.5, timestamp: timestamp3},
      ],
      observationRefs: [],
      startTime: null,
    });
  });
});
