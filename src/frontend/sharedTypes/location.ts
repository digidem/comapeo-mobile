import {type TaskManagerError} from 'expo-task-manager';

export type FullLocationData = {
  coords: {
    altitude: number;
    altitudeAccuracy: number;
    latitude: number;
    accuracy: number;
    longitude: number;
    heading: number;
    speed: number;
  };
  timestamp: number;
};

export type LocationHistoryPoint = {
  timestamp: number;
} & LonLatData;

export type LonLatData = {
  longitude: number;
  latitude: number;
};

export type LocationCallbackInfo = {
  data: {locations: FullLocationData[]} | null;
  error: TaskManagerError | null;
};

export const LOCATION_TASK_NAME = 'background-location-task';
