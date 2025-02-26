/* eslint-disable jest/no-done-callback */ // the "done" callbacks are NOT promises, so this patterns follows the jest documentation
import * as Location from 'expo-location';

import {
  convertPosition,
  createDraftObservationStore,
} from './PersistedStores/DraftObservationStore';
import {AppState} from 'react-native';
import {} from 'jest/';
import {
  createDraftObservationLocationUpdator,
  STALE_LOCATION_THRESHOLD_MS,
} from '../lib/createDraftObservationLocationUpdator';

jest.mock('react-native', () => {
  return {
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn(),
    },
  };
});

jest.mock('expo-image-manipulator', () => {
  return {
    manipulateAsync: jest.fn(),
  };
});

jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  Accuracy: {Highest: 5},
}));

jest.mock(
  'react-native/Libraries/PermissionsAndroid/PermissionsAndroid',
  () => {
    const PermissionsAndroid = jest.requireActual(
      'react-native/Libraries/PermissionsAndroid/PermissionsAndroid',
    );
    console.log(PermissionsAndroid);
    return {
      ...PermissionsAndroid,
      check: jest.fn(() => new Promise(resolve => resolve(true))),
      request: jest.fn(() => new Promise(resolve => resolve(true))),
    };
  },
);

test('should check location permissions on init', async () => {
  (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
    granted: true,
  });

  const testStore = createDraftObservationStore({persist: false});

  await createDraftObservationLocationUpdator(testStore);

  expect(Location.getForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
});

test('should not start tracking if location permission is denied', async () => {
  (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
    granted: false,
  });

  const testStore = createDraftObservationStore({persist: false});

  await createDraftObservationLocationUpdator(testStore);

  expect(Location.watchPositionAsync).not.toHaveBeenCalled();
});

test('should start watching position when app is active, permission granted, and draft is new', done => {
  (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
    granted: true,
  });

  const testStore = createDraftObservationStore({persist: false});
  testStore.actions.createDraft();

  const addEventListenerMock = AppState.addEventListener as jest.Mock;
  addEventListenerMock.mockImplementation((event, callback) => {
    if (event === 'change') {
      // Simulate app state change to 'active'
      callback('active');
    }
  });

  createDraftObservationLocationUpdator(testStore);

  const watchPositionAsyncMock = Location.watchPositionAsync as jest.Mock;

  watchPositionAsyncMock.mockImplementation((options, callback) => {
    const newLocation: Location.LocationObject = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 1,
        altitude: null,
        heading: null,
        speed: null,
        altitudeAccuracy: null,
      },
      timestamp: Date.now(),
    };
    // Simulate a position update callback being called
    callback(newLocation);
    expect(Location.watchPositionAsync).toHaveBeenCalledTimes(1);
    done();
  });
});

test('should update location if accuracy has gotten better and user has not moved from threshold', done => {
  (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
    granted: true,
  });

  const testStore = createDraftObservationStore({persist: false});
  testStore.actions.createDraft();

  // Set an initial position
  const initialPosition: Location.LocationObject = {
    coords: {
      latitude: 37.774918,
      longitude: -122.4194,
      accuracy: 2,
      altitude: null,
      heading: null,
      speed: null,
      altitudeAccuracy: null,
    },
    timestamp: Date.now(),
  };

  // @ts-expect-error typescript can not infer that initialPosition is not null from the previous line
  testStore.instance.setState(prev => ({
    ...prev,
    initialPosition,
  }));

  testStore.actions.updatePosition({
    manualLocation: false,
    position: initialPosition,
  });

  createDraftObservationLocationUpdator(testStore);

  const watchPositionAsyncMock = Location.watchPositionAsync as jest.Mock;

  watchPositionAsyncMock.mockImplementation((options, callback) => {
    const newLocation: Location.LocationObject = {
      coords: {
        latitude: 37.774909, //1m away
        longitude: -122.4194,
        accuracy: 1,
        altitude: null,
        heading: null,
        speed: null,
        altitudeAccuracy: null,
      },
      timestamp: Date.now(),
    };

    callback(newLocation);

    // check initial position has remained the same
    expect(testStore.instance.getState().initialPosition).toEqual(
      initialPosition,
    );

    //check that location has updated
    expect(testStore.instance.getState().value?.lat).toEqual(
      newLocation.coords.latitude,
    );
    expect(testStore.instance.getState().value?.lon).toEqual(
      newLocation.coords.longitude,
    );
    expect(testStore.instance.getState().value?.metadata?.position).toEqual(
      convertPosition(newLocation),
    );
    done();
  });
});

test('should not update position if location is stale', done => {
  (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
    granted: true,
  });

  const testStore = createDraftObservationStore({persist: false});
  testStore.actions.createDraft();

  const addEventListenerMock = AppState.addEventListener as jest.Mock;
  addEventListenerMock.mockImplementation((event, callback) => {
    if (event === 'change') {
      // Simulate app state change to 'active'
      callback('active');
    }
  });

  createDraftObservationLocationUpdator(testStore);

  const originalLat = testStore.instance.getState().value?.lat;
  const originalLon = testStore.instance.getState().value?.lon;
  const originalPosition =
    testStore.instance.getState().value?.metadata?.position;

  const watchPositionAsyncMock = Location.watchPositionAsync as jest.Mock;
  watchPositionAsyncMock.mockImplementation((options, callback) => {
    const staleTimestamp = Date.now() - STALE_LOCATION_THRESHOLD_MS - 1;
    // Simulate a position update callback being called
    callback({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      timestamp: staleTimestamp,
    });
    expect(testStore.instance.getState().value?.lat).toEqual(originalLat);
    expect(testStore.instance.getState().value?.lon).toEqual(originalLon);
    expect(testStore.instance.getState().value?.metadata?.position).toEqual(
      originalPosition,
    );
    done();
  });
});

test('should not update position if user has moved past threshold', done => {
  (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
    granted: true,
  });

  const testStore = createDraftObservationStore({persist: false});
  testStore.actions.createDraft();

  createDraftObservationLocationUpdator(testStore);

  // Set an initial position
  const initialPosition: Location.LocationObject = {
    coords: {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 1,
      altitude: null,
      heading: null,
      speed: null,
      altitudeAccuracy: null,
    },
    timestamp: Date.now(),
  };

  // @ts-expect-error typescript can not infer that initialPosition is not null from the previous line
  testStore.instance.setState(prev => ({
    ...prev,
    initialPosition,
  }));

  testStore.actions.updatePosition({
    manualLocation: false,
    position: initialPosition,
  });

  const watchPositionAsyncMock = Location.watchPositionAsync as jest.Mock;

  watchPositionAsyncMock.mockImplementation((options, callback) => {
    const newLocation: Location.LocationObject = {
      coords: {
        latitude: 37.774909,
        longitude: -122.4194,
        accuracy: 1,
        altitude: null,
        heading: null,
        speed: null,
        altitudeAccuracy: null,
      },
      timestamp: Date.now(),
    };

    callback(newLocation);

    // check initial position has remained the same
    expect(testStore.instance.getState().value?.lat).toEqual(
      initialPosition.coords.latitude,
    );
    expect(testStore.instance.getState().value?.lon).toEqual(
      initialPosition.coords.longitude,
    );
    expect(testStore.instance.getState().value?.metadata?.position).toEqual(
      convertPosition(initialPosition),
    );
    done();
  });
});

test('should not update if accuracy is worse', done => {
  (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
    granted: true,
  });

  const testStore = createDraftObservationStore({persist: false});
  testStore.actions.createDraft();

  createDraftObservationLocationUpdator(testStore);

  // Set an initial position
  const initialPosition: Location.LocationObject = {
    coords: {
      latitude: 37.774918,
      longitude: -122.4194,
      accuracy: 1,
      altitude: null,
      heading: null,
      speed: null,
      altitudeAccuracy: null,
    },
    timestamp: Date.now(),
  };

  // @ts-expect-error typescript can not infer that initialPosition is not null from the previous line
  testStore.instance.setState(prev => ({
    ...prev,
    initialPosition,
  }));

  testStore.actions.updatePosition({
    manualLocation: false,
    position: initialPosition,
  });

  const watchPositionAsyncMock = Location.watchPositionAsync as jest.Mock;

  watchPositionAsyncMock.mockImplementation((options, callback) => {
    const newLocation: Location.LocationObject = {
      coords: {
        latitude: 37.774909, //1m away
        longitude: -122.4194,
        accuracy: 2,
        altitude: null,
        heading: null,
        speed: null,
        altitudeAccuracy: null,
      },
      timestamp: Date.now(),
    };

    callback(newLocation);

    // check initial position has remained the same
    expect(testStore.instance.getState().value?.lat).toEqual(
      initialPosition.coords.latitude,
    );
    expect(testStore.instance.getState().value?.lon).toEqual(
      initialPosition.coords.longitude,
    );
    expect(testStore.instance.getState().value?.metadata?.position).toEqual(
      convertPosition(initialPosition),
    );
    done();
  });
});
