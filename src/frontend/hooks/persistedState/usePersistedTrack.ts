import {calculateTotalDistance} from '../../utils/distance.ts';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import {createPersistedState} from './createPersistedState.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCATION_DATA_KEY} from '../../lib/trackLocationsStorage.ts';

type TracksStoreState = {
  locationHistory: LocationHistoryPoint[];
  observations: string[];
  distance: number;
  description: string;
  setDescription: (val: string) => void;
  addNewObservation: (observationId: string) => void;
  setLocations: (locationData: LocationHistoryPoint[]) => void;
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

export const usePersistedTrack = createPersistedState<TracksStoreState>(
  set => ({
    isTracking: false,
    locationHistory: [],
    observations: [],
    distance: 0,
    description: '',
    trackingSince: null,
    setDescription: (val: string) => set(state => ({description: val})),
    addNewObservation: (id: string) =>
      set(state => ({observations: [...state.observations, id]})),
    addNewLocations: (locations: LocationHistoryPoint[]) =>
      set(({locationHistory: currentHistory}) => ({
        locationHistory: [...currentHistory, ...locations],
      })),
    setLocations: data =>
      set(({locationHistory, distance}) => {
        if (data.length > 1) {
          return {
            locationHistory: data,
            distance: calculateTotalDistance(data),
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
        AsyncStorage.removeItem(LOCATION_DATA_KEY);
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
