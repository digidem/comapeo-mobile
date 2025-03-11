import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import * as v from 'valibot';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {LocationHistoryPoint} from '../sharedTypes/location';
import {calculateTotalDistance} from '../utils/distance';

const TrackStateSchema = v.intersect([
  v.object({
    description: v.string(),
    distance: v.number(),
    locationHistory: v.array(
      // TODO: Create schema for this
      v.object({
        latitude: v.number(),
        longitude: v.number(),
        timestamp: v.number(),
      }),
    ),
    observationRefs: v.array(
      // TODO: Create schema for this
      v.object({
        docId: v.string(),
        versionId: v.string(),
      }),
    ),
  }),
  v.union([
    v.object({
      isTracking: v.literal(true),
      trackingSince: v.date(),
    }),
    v.object({
      isTracking: v.literal(false),
      trackingSince: v.null(),
    }),
  ]),
]);

export type TrackState = v.InferOutput<typeof TrackStateSchema>;

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
        migrate: (persistedState, version): TrackState => {
          const newState = createInitialState();

          if (version === 0) {
            try {
              // Even if persisted state has fields that are not part of the schema,
              // Valibot will only extract the relevant fields (assuming all relevant ones pass validation).
              // https://valibot.dev/guides/objects/
              return v.parse(TrackStateSchema, persistedState, {
                abortEarly: true,
              });
            } catch {
              return newState;
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
    addNewObservation: (
      observationRef: TrackState['observationRefs'][number],
    ) => {
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
