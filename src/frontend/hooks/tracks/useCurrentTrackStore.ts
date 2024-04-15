import {create} from 'zustand';
import {calculateTotalDistance} from '../../utils/distance';

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
  distance: number;
  trackingSince: Date;
  addNewObservation: (observationId: string) => void;
  addNewLocations: (locationData: FullLocationData[]) => void;
  clearLocationHistory: () => void;
  setTracking: (val: boolean) => void;
};

export const useCurrentTrackStore = create<TracksStoreState>(set => ({
  isTracking: false,
  locationHistory: [],
  observations: [],
  distance: 0,
  trackingSince: new Date(0),
  addNewObservation: (id: string) =>
    set(state => ({observations: [...state.observations, id]})),
  addNewLocations: data =>
    set(state => {
      const {locationHistory} = state;

      if (data.length > 1) {
        return {
          locationHistory: [...locationHistory, ...data],
          distance: state.distance + calculateTotalDistance(data),
        };
      }
      if (locationHistory.length < 1) {
        return {
          locationHistory: [...locationHistory, ...data],
        };
      }
      const lastLocation = locationHistory[locationHistory.length - 1];
      if (!lastLocation) {
        throw Error('No lastLocation for state.locationHistory.length > 1');
      }
      return {
        locationHistory: [...state.locationHistory, ...data],
        distance:
          state.distance + calculateTotalDistance([lastLocation, ...data]),
      };
    }),
  clearLocationHistory: () => set(() => ({locationHistory: []})),
  setTracking: (val: boolean) =>
    set(() => ({
      isTracking: val,
      trackingSince: val ? new Date() : new Date(0),
    })),
}));
