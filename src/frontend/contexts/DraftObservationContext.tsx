import * as React from 'react';

import {useStore} from 'zustand';
import CheapRuler from 'cheap-ruler';
import * as Location from 'expo-location';
import {AppState, type AppStateStatus} from 'react-native';
import {
  DraftState,
  DraftObservationStore,
  convertPosition,
} from './PersistedStores/DraftObservationStore.ts';
import {useLocationContext} from './LocationContext.tsx';

export function useDraftObservationState(): DraftState;
export function useDraftObservationState<T>(
  selector: (state: DraftState) => T,
): T;
export function useDraftObservationState<T>(
  selector?: (state: DraftState) => T,
) {
  const {instance} = useDraftObservationContext();
  return useStore(instance, selector!);
}

export function useDraftObservationActions() {
  const {actions} = useDraftObservationContext();
  return actions;
}

const DraftObservationContext =
  React.createContext<DraftObservationStore | null>(null);

type DraftObservationProviderProps = {
  children: React.ReactNode;
  draftObservationStore: DraftObservationStore;
};

/** `draftObservationStore` should be initialized outside of react life cycle */
export const DraftObservationProvider = ({
  children,
  draftObservationStore,
}: DraftObservationProviderProps) => {
  const locationStore = useLocationContext();

  React.useEffect(() => {
    const cleanup = createDraftObservationLocationUpdator({
      draftObservationStore,
      locationStore,
    });

    return () => cleanup();
    // these stores are stable and will not cause re-renders
  }, [draftObservationStore, locationStore]);

  return (
    <DraftObservationContext value={draftObservationStore}>
      {children}
    </DraftObservationContext>
  );
};

function useDraftObservationContext() {
  const value = React.useContext(DraftObservationContext);

  if (!value) {
    throw new Error('Must set up the DraftObservationContext first');
  }
  return value;
}

/** We don't update the position of an observation with the location from the
 * device location provider if the location is older than this threshold */
const STALE_LOCATION_THRESHOLD_MS = 1000;
/** Over this threshold we consider the user to have moved away from the
 * location of the observation, and we stop refining GPS position. We use the
 * accuracy of the first location as the default, and use this as a fallback if
 * we do not have an accuracy value. */
const MOVED_AWAY_THRESHOLD_METERS = 100;
/** The factor of accuracy that a new location must be to consider the user to
 * have moved away. E.g. if the accuracy of the initial position is 10m and the
 * factor is 1.5, then we consider the user to have moved away if a location
 * update is 15m away. */
const ACCURACY_MOVED_AWAY_FACTOR = 1.5;

function createDraftObservationLocationUpdator({
  draftObservationStore,
  locationStore,
}: {
  draftObservationStore: DraftObservationStore;
  locationStore: ReturnType<typeof useLocationContext>;
}) {
  let appState: AppStateStatus = AppState.currentState;
  let isNewlyCreatedDraftInStore = isNewlyCreatedDraft(
    draftObservationStore.instance.getState(),
  );
  let locationStoreSubscriber: (() => void) | null = null;

  const appStateSubscription = AppState.addEventListener(
    'change',
    async nextAppState => {
      appState = nextAppState;
      watchPositionIfNeeded();
    },
  );

  const draftObservationStoreSub = draftObservationStore.instance.subscribe(
    storeState => {
      isNewlyCreatedDraftInStore = isNewlyCreatedDraft(storeState);
      watchPositionIfNeeded();
    },
  );

  async function watchPositionIfNeeded() {
    const shouldBeWatchingPosition =
      appState === 'active' &&
      isNewlyCreatedDraftInStore &&
      locationStore.getState().locationPermission === 'granted';

    if (shouldBeWatchingPosition && !locationStoreSubscriber) {
      locationStoreSubscriber = locationStore.subscribe(store => {
        const location = store.location;
        if (location) {
          onPositionUpdate(location);
        }
      });
    }

    if (!shouldBeWatchingPosition && locationStoreSubscriber) {
      locationStoreSubscriber();
      locationStoreSubscriber = null;
    }
  }

  function onPositionUpdate(location: Location.LocationObject) {
    // set initial position if not already set
    draftObservationStore.instance.setState(prev => {
      if (prev.initialPosition || !prev.value) {
        return prev;
      }
      return {...prev, initialPosition: convertPosition(location)};
    });

    const {value: currentDraft, initialPosition} =
      draftObservationStore.instance.getState();

    if (!currentDraft) return;

    const isManualLocation = !!currentDraft.metadata?.manualLocation;
    if (isManualLocation) return;

    const isStale =
      Date.now() - location.timestamp > STALE_LOCATION_THRESHOLD_MS;
    if (isStale) return;

    const initialAccuracy = initialPosition?.coords.accuracy;
    const movedAwayThreshold = initialAccuracy
      ? initialAccuracy * ACCURACY_MOVED_AWAY_FACTOR
      : MOVED_AWAY_THRESHOLD_METERS;
    const hasMovedAway =
      initialPosition &&
      distanceBetweenCoords(initialPosition.coords, location.coords) >
        movedAwayThreshold;
    if (hasMovedAway) return;

    const currentDraftCoords = currentDraft.metadata?.position?.coords;

    const isMoreAccurate =
      !currentDraftCoords ||
      !location.coords.accuracy ||
      !currentDraftCoords.accuracy ||
      location.coords.accuracy < currentDraftCoords.accuracy;

    if (!isMoreAccurate) return;

    draftObservationStore.actions.updatePosition({
      manualLocation: false,
      position: location,
      positionProvider: locationStore.getState().providerStatus,
    });
  }

  return function cleanup() {
    appStateSubscription.remove();
    draftObservationStoreSub();
    if (locationStoreSubscriber) {
      locationStoreSubscriber();
      locationStoreSubscriber = null;
    }
  };
}

function isNewlyCreatedDraft(storeState: DraftState) {
  const isObservationInStore = !!storeState.value;
  const isNewlyCreatedObservation = !storeState.id;
  return isObservationInStore && isNewlyCreatedObservation;
}

function distanceBetweenCoords(
  a: {latitude: number; longitude: number},
  b: {latitude: number; longitude: number},
) {
  const ruler = new CheapRuler(a.latitude);
  return ruler.distance([a.longitude, a.latitude], [b.longitude, b.latitude]);
}
