import {create} from 'zustand';
import {calculateTotalDistance} from '../../utils/distance';
import {LocationHistoryPoint} from '../../sharedTypes/location';

type TracksStoreState = {
  isTracking: boolean;
  locationHistory: LocationHistoryPoint[];
  observations: string[];
  distance: number;
  trackingSince: Date;
  addNewObservation: (observationId: string) => void;
  addNewLocations: (locationData: LocationHistoryPoint[]) => void;
  clearCurrentTrack: () => void;
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
    set(({locationHistory, distance}) => {
      if (data.length > 1) {
        return {
          locationHistory: [...locationHistory, ...data],
          distance: distance + calculateTotalDistance(data),
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
        locationHistory: [...locationHistory, ...data],
        distance: distance + calculateTotalDistance([lastLocation, ...data]),
      };
    }),
  clearCurrentTrack: () =>
    set(() => ({
      locationHistory: [],
      trackingSince: new Date(0),
      isTracking: false,
      observations: [],
    })),
  setTracking: (val: boolean) =>
    set(() => ({
      isTracking: val,
      trackingSince: val ? new Date() : new Date(0),
    })),
}));
