import {create} from 'zustand';
import {calculateTotalDistance} from '../../utils/distance';
import {LocationHistoryPoint} from '../../sharedTypes/location';

type TracksStoreState = {
  locationHistory: LocationHistoryPoint[];
  observations: string[];
  distance: number;
  addNewObservation: (observationId: string) => void;
  addNewLocations: (locationData: LocationHistoryPoint[]) => void;
  clearCurrentTrack: () => void;
  setTracking: (val: boolean) => void;
} & (
  | {
      isTracking: true;
      trackingSince: Date;
    }
  | {
      isTracking: false;
      trackingSince: null;
    }
);

export const useCurrentTrackStore = create<TracksStoreState>(set => ({
  isTracking: false,
  locationHistory: [],
  observations: [],
  distance: 0,
  trackingSince: null,
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
    set(() =>
      val
        ? {isTracking: true, trackingSince: new Date()}
        : {isTracking: false, trackingSince: null},
    ),
}));
