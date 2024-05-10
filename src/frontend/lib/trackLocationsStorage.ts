import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FullLocationData,
  LocationHistoryPoint,
} from '../sharedTypes/location.ts';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_DATA_KEY = 'comapeo/track_locations';
const STORE_LAST_N = 5000;

type StoredLocationData = {
  lat: number;
  lon: number;
  t: number;
};

export type LocationCallbackInfo = {
  data: {locations: FullLocationData[]} | null;
  error: TaskManager.TaskManagerError | null;
};

export const LOCATION_TASK_NAME = 'background-location-task';

export const locationTask = async ({data, error}: LocationCallbackInfo) => {
  if (error) {
    console.error('Error while processing location update callback', error);
  }
  if (data?.locations) {
    await appendData(
      data.locations.map(loc => ({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: loc.timestamp,
      })),
    );
  }
};

export async function appendData(locations: LocationHistoryPoint[]) {
  try {
    const data = (await getData()) ?? [];

    const newData = [...toStored(data), ...toStored(locations)].slice(
      -STORE_LAST_N,
    );
    await AsyncStorage.setItem(LOCATION_DATA_KEY, JSON.stringify(newData));
  } catch (error) {
    return null;
  }
}

function removeDuplicates(locations: StoredLocationData[]) {
  if (locations.length === 0) {
    return [];
  }

  const first = locations[0]!;
  const filtered = [first];

  let lastValue = first;
  for (const location of locations) {
    const sameCoords =
      location.lat === lastValue.lat && location.lon === lastValue.lon;

    if (!sameCoords) {
      lastValue = location;
      filtered.push(location);
    }
  }
  return filtered;
}

export async function getData(): Promise<LocationHistoryPoint[] | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(LOCATION_DATA_KEY);
    if (jsonValue === null) {
      return null;
    }
    return fromStored(JSON.parse(jsonValue));
  } catch (error) {
    return null;
  }
}

function toStored(locations: LocationHistoryPoint[]): StoredLocationData[] {
  return locations.map(({latitude, longitude, timestamp}) => ({
    lat: latitude,
    lon: longitude,
    t: timestamp,
  }));
}

function fromStored(
  storedLocations: StoredLocationData[],
): LocationHistoryPoint[] {
  return storedLocations.map(({lat, lon, t}) => ({
    latitude: lat,
    longitude: lon,
    timestamp: t,
  }));
}
