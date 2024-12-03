import * as Location from 'expo-location';
import {AppState, type AppStateStatus} from 'react-native';
import CheapRuler from 'cheap-ruler';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import {
  convertPosition,
  createDraftObservationStore,
  type DraftState,
} from '../hooks/persistedState/usePersistedDraftObservationNew';

const DraftObservationContext = createContext<ReturnType<
  typeof createDraftObservationStore
> | null>(null);

export function DraftObservationProvider({children}: PropsWithChildren<{}>) {
  const [value] = useState(() => {
    const store = createDraftObservationStore();
    createDraftObservationLocationUpdator(store);
    return store;
  });

  return (
    <DraftObservationContext.Provider value={value}>
      {children}
    </DraftObservationContext.Provider>
  );
}

export function useDraftObservationContext() {
  const result = useContext(DraftObservationContext);

  if (!result) {
    throw new Error('Must set up the DraftObservationContext Provider first');
  }

  return result;
}

const LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Highest,
  timeInterval: 1000,
};
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

export async function createDraftObservationLocationUpdator({
  store,
  actions: {updatePosition},
}: ReturnType<typeof createDraftObservationStore>) {
  let {granted: locationPermissionGranted} =
    await Location.getForegroundPermissionsAsync();
  let locationSubscriptionPromise: Promise<Location.LocationSubscription> | null =
    null;
  let appState: AppStateStatus = AppState.currentState;
  let isNewlyCreatedDraftInStore = isNewlyCreatedDraft(store.getState());

  AppState.addEventListener('change', async nextAppState => {
    appState = nextAppState;
    if (appState === 'active' && !locationPermissionGranted) {
      locationPermissionGranted = (
        await Location.getForegroundPermissionsAsync()
      ).granted;
    }
    watchPositionIfNeeded();
  });

  store.subscribe(storeState => {
    isNewlyCreatedDraftInStore = isNewlyCreatedDraft(storeState);
    watchPositionIfNeeded();
  });

  async function watchPositionIfNeeded() {
    const shouldBeWatchingPosition =
      appState === 'active' &&
      isNewlyCreatedDraftInStore &&
      locationPermissionGranted;

    if (shouldBeWatchingPosition && !locationSubscriptionPromise) {
      locationSubscriptionPromise = Location.watchPositionAsync(
        LOCATION_OPTIONS,
        onPositionUpdate,
      );
    } else if (!shouldBeWatchingPosition && locationSubscriptionPromise) {
      // Avoid a race condition by nulling the state before awaiting the promise
      const locationSubscriptionPromiseCopy = locationSubscriptionPromise;
      locationSubscriptionPromise = null;
      const subscription = await locationSubscriptionPromiseCopy;
      subscription.remove();
    }
  }

  function onPositionUpdate(location: Location.LocationObject) {
    const {value: currentDraft, initialPosition} = store.getState();
    if (!currentDraft) return;

    const isManualLocation = !!currentDraft.metadata?.manualLocation;
    if (isManualLocation) return;

    const isStale =
      Date.now() - location.timestamp > STALE_LOCATION_THRESHOLD_MS;
    if (isStale) return;

    store.setState(prev => {
      if (prev.initialPosition || !prev.value) return prev;
      return {...prev, initialPosition: convertPosition(location)};
    });

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

    updatePosition({
      manualLocation: false,
      position: location,
      // TODO: Also add positionProvider. Probably needs access to the locationProvider store.
    });
  }
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
