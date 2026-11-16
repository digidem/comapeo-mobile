import {LocationObject} from 'expo-location';
import {getLocationStatus} from './utils';

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

it('returns "error" when gps or location services are disabled', () => {
  expect(
    getLocationStatus({
      providerStatus: {
        gpsAvailable: false,
        locationServicesEnabled: true,
        backgroundModeEnabled: false,
      },
    }),
  ).toEqual({status: 'error'});
});

it('returns "searching" when location is missing', () => {
  expect(
    getLocationStatus({
      providerStatus: {
        gpsAvailable: true,
        locationServicesEnabled: true,
        backgroundModeEnabled: false,
      },
    }),
  ).toEqual({status: 'searching'});
});

it('returns "searching" when location is stale', () => {
  const staleLocation = {
    timestamp: Date.now() - 120_000,
    coords: {accuracy: 5},
  } as LocationObject;

  const result = getLocationStatus({
    location: staleLocation,
    providerStatus: {
      gpsAvailable: true,
      locationServicesEnabled: true,
      backgroundModeEnabled: false,
    },
  });

  expect(result).toEqual({status: 'searching'});
});

it('returns "good" when location is recent and valid', () => {
  const recentLocation = {
    timestamp: Date.now(),
    coords: {accuracy: 5},
  } as LocationObject;

  expect(
    getLocationStatus({
      location: recentLocation,
      providerStatus: {
        gpsAvailable: true,
        locationServicesEnabled: true,
        backgroundModeEnabled: false,
      },
    }),
  ).toEqual({status: 'good', accuracy: 5});
});
