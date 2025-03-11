import {Track} from '@comapeo/schema';
import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {LocationHistoryPoint} from '../sharedTypes/location';
import {calculateTotalDistance} from '../utils/distance';

type ObservationRef = Track['observationRefs'][number];

export type TrackState = {
  description: string;
  distance: number;
  locationHistory: Array<LocationHistoryPoint>;
  observationRefs: Array<ObservationRef>;
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

// NOTE: Do not change!
const STORAGE_KEY = 'MapeoTrack' as const;

function createInitialState(): TrackState {
  return {
    description: '',
    distance: 0,
    isTracking: false,
    locationHistory: [],
    observationRefs: [],
    trackingSince: null,
  };
}

export function createTrackStore({persist} = {persist: false}) {
  let store: StoreApi<TrackState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 1,
        migrate: (persistedState, version) => {
          const newState = createInitialState();

          // TODO: ideally use validation with valibot
          if (version === 0) {
            if (!(typeof persistedState === 'object')) {
              return newState;
            }

            if (!persistedState) {
              return newState;
            }

            if (
              'locationHistory' in persistedState &&
              Array.isArray(persistedState.locationHistory)
            ) {
              newState.locationHistory = persistedState.locationHistory;
            }

            if (
              'observationRefs' in persistedState &&
              Array.isArray(persistedState.observationRefs)
            ) {
              newState.observationRefs = persistedState.observationRefs;
            }

            if (
              'description' in persistedState &&
              typeof persistedState.description === 'string'
            ) {
              newState.description = persistedState.description;
            }

            if (
              'distance' in persistedState &&
              typeof persistedState.distance === 'number'
            ) {
              newState.distance = persistedState.distance;
            }

            if (
              'isTracking' in persistedState &&
              typeof persistedState.isTracking === 'boolean'
            ) {
              newState.isTracking = persistedState.isTracking;
            }

            if (
              'trackingSince' in persistedState &&
              typeof persistedState.trackingSince === 'string'
            ) {
              newState.trackingSince = new Date(persistedState.trackingSince);
            }
          }

          return newState;
        },
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setDescription: (description: string) => {
      store.setState({description});
    },
    addNewObservation: (observationRef: ObservationRef) => {
      store.setState(prev => {
        return {
          observationRefs: [...prev.observationRefs, observationRef],
        };
      });
    },
    addNewLocations: (data: Array<LocationHistoryPoint>) => {
      store.setState(prev => {
        if (data.length > 1) {
          return {
            locationHistory: [...prev.locationHistory, ...data],
            distance: prev.distance + calculateTotalDistance(data),
          };
        }

        if (prev.locationHistory.length < 1) {
          return {
            locationHistory: [...prev.locationHistory, ...data],
          };
        }

        const lastLocation =
          prev.locationHistory[prev.locationHistory.length - 1];

        if (!lastLocation) {
          throw Error('No lastLocation for state.locationHistory.length > 1');
        }

        return {
          locationHistory: [...prev.locationHistory, ...data],
          distance:
            prev.distance + calculateTotalDistance([lastLocation, ...data]),
        };
      });
    },
    clearCurrentTrack: () => {
      store.setState({
        description: '',
        distance: 0,
        isTracking: false,
        locationHistory: [],
        observationRefs: [],
        trackingSince: null,
      });
    },
    setTracking: (isTracking: boolean) => {
      store.setState(
        isTracking
          ? {isTracking: true, trackingSince: new Date()}
          : {isTracking: false, trackingSince: null},
      );
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type TrackStore = ReturnType<typeof createTrackStore>;

export const TrackStoreContext = createContext<TrackStore | null>(null);
export const TrackStoreProvider = TrackStoreContext.Provider;

function useTrackStoreContext() {
  const value = useContext(TrackStoreContext);

  if (!value) {
    throw new Error('Must set up the TrackStoreProvider first');
  }

  return value;
}

export function useTrackState(): TrackState;
export function useTrackState<T>(selector: (state: TrackState) => T): T;
export function useTrackState<T>(selector?: (state: TrackState) => T) {
  const {instance} = useTrackStoreContext();
  return useStore(instance, selector!);
}

export function useTrackActions() {
  const {actions} = useTrackStoreContext();
  return actions;
}
