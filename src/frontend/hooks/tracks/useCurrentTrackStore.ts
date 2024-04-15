import {create} from 'zustand';

export type LocationData = {
  coords: {
    latitude: number;
    accuracy: number;
    longitude: number;
  };
  timestamp: number;
};
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
type TracksStoreState = {
  isTracking: boolean;
  locationHistory: FullLocationData[];
  observations: string[];
  addNewObservation: (observationId: string) => void;
  addNewLocations: (locationData: FullLocationData[]) => void;
  clearLocationHistory: () => void;
  setTracking: (val: boolean) => void;
};

export const useCurrentTrackStore = create<TracksStoreState>(set => ({
  isTracking: false,
  locationHistory: [],
  observations: [],
  addNewObservation: (id: string) =>
    set(state => ({observations: [...state.observations, id]})),
  addNewLocations: data =>
    set(state => ({locationHistory: [...state.locationHistory, ...data]})),
  clearLocationHistory: () => set(() => ({locationHistory: []})),
  setTracking: (val: boolean) => set(() => ({isTracking: val})),
}));
