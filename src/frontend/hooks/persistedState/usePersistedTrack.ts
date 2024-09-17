import {calculateTotalDistance} from '../../utils/distance.ts';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import {createPersistedStore} from './createPersistedState.ts';
import {useStore} from 'zustand';
import {Track} from '@comapeo/schema';

type ObservationRef = Track['observationRefs'][0];

type TracksStoreState = {
  locationHistory: LocationHistoryPoint[];
  observationRefs: ObservationRef[];
  distance: number;
  description: string;
  setDescription: (val: string) => void;
  addNewObservation: (observationRef: ObservationRef) => void;
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

export const tracksStore = createPersistedStore<TracksStoreState>(
  set => ({
    isTracking: false,
    locationHistory: [],
    observationRefs: [],
    distance: 0,
    description: '',
    trackingSince: null,
    setDescription: (val: string) => set(() => ({description: val})),
    addNewObservation: observationRef =>
      set(state => ({
        observationRefs: [...state.observationRefs, observationRef],
      })),
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
      set(() => {
        return {
          locationHistory: [],
          trackingSince: null,
          distance: 0,
          isTracking: false,
          observations: [],
          description: '',
        };
      }),
    setTracking: (val: boolean) =>
      set(() =>
        val
          ? {isTracking: true, trackingSince: new Date()}
          : {isTracking: false, trackingSince: null},
      ),
  }),
  'MapeoTrack',
);

// Taken from https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#bounded-usestore-hook-for-vanilla-stores
export function usePersistedTrack(): TracksStoreState;
export function usePersistedTrack<T>(
  selector: (state: TracksStoreState) => T,
): T;
export function usePersistedTrack<T>(
  selector?: (state: TracksStoreState) => T,
) {
  return useStore(tracksStore, selector!);
}
