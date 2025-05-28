import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createTrackStore,
  type TrackStore,
  TrackStoreProvider,
} from '../contexts/TrackStoreContext';
import {useCurrentTrackState} from './useTracking';
import {calculateTotalDistance} from '../utils/distance';

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

describe('useCurrentTrackState()', () => {
  test('initial blank state', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const currentTracksHook = renderHook(() => useCurrentTrackState(), {
      wrapper,
    });

    expect(currentTracksHook.result.current).toStrictEqual({
      hasActiveTrack: false,
      totalDistance: 0,
      locationHistory: [],
      trackingSince: null,
    });
  });

  test('with location history', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const currentTracksHook = renderHook(() => useCurrentTrackState(), {
      wrapper,
    });

    const firstTimestamp = Date.now();

    const location1 = {
      latitude: 37.7749,
      longitude: -122.41942,
      timestamp: firstTimestamp,
    };
    const location2 = {
      latitude: 37.774975,
      longitude: -122.41942,
      timestamp: firstTimestamp + 10000,
    }; // Point 2 (~8.3m North)
    const location3 = {
      latitude: 37.77505,
      longitude: -122.41942,
      timestamp: firstTimestamp + 20000,
    }; // Point 3 (~8.3m North)
    const location4 = {
      latitude: 37.775125,
      longitude: -122.41942,
      timestamp: firstTimestamp + 30000,
    }; // Point 4 (~8.3m North)

    // Add a location to the store
    act(() => {
      trackStore.actions.addNewLocations([location1]);
    });

    expect(currentTracksHook.result.current).toStrictEqual({
      hasActiveTrack: true,
      totalDistance: 0, // No distance calculation in this test
      locationHistory: [location1],
      trackingSince: new Date(firstTimestamp),
    });

    // Add a location to the store
    act(() => {
      trackStore.actions.addNewLocations([location2, location3, location4]);
    });

    const locationHistory = [location1, location2, location3, location4];
    const totalDistanceKm = calculateTotalDistance({
      points: locationHistory,
      units: 'kilometers',
    });

    expect(currentTracksHook.result.current).toStrictEqual({
      hasActiveTrack: true,
      totalDistance: totalDistanceKm,
      locationHistory: [location1, location2, location3, location4],
      trackingSince: new Date(firstTimestamp),
    });
  });

  test('clearing tracks resets state', () => {
    const trackStore = createTrackStore();
    const wrapper = createWrapper(trackStore);

    const currentTracksHook = renderHook(() => useCurrentTrackState(), {
      wrapper,
    });

    const firstTimestamp = Date.now();

    const location = {
      latitude: 37.7749,
      longitude: -122.41942,
      timestamp: firstTimestamp,
    };

    // Add a location to the store
    act(() => {
      trackStore.actions.addNewLocations([location]);
    });

    expect(currentTracksHook.result.current).toStrictEqual({
      hasActiveTrack: true,
      totalDistance: 0,
      locationHistory: [location],
      trackingSince: new Date(firstTimestamp),
    });

    // Clear the current track
    act(() => {
      trackStore.actions.clearCurrentTrack();
    });

    expect(currentTracksHook.result.current).toStrictEqual({
      hasActiveTrack: false,
      totalDistance: 0,
      locationHistory: [],
      trackingSince: null,
    });
  });
});
