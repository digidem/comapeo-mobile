import * as Location from 'expo-location';
import {AppState, type AppStateStatus} from 'react-native';
import {
  draftObservationStore,
  type DraftObservationStoreState,
} from '../hooks/persistedState/usePersistedDraftObservation/index.ts';
import CheapRuler from 'cheap-ruler';

const LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Highest,
  timeInterval: 1000,
};
const STALE_LOCATION_THRESHOLD_MS = 1000;

export async function draftObservationLocationUpdator() {
  let {granted: locationPermissionGranted} =
    await Location.requestForegroundPermissionsAsync();
  let locationSubscriptionPromise: Promise<Location.LocationSubscription> | null =
    null;
  let appState: AppStateStatus = AppState.currentState;
  let isNewlyCreatedDraftInStore = isNewlyCreatedDraft(
    draftObservationStore.getState(),
  );

  AppState.addEventListener('change', async nextAppState => {
    appState = nextAppState;
    if (appState === 'active' && !locationPermissionGranted) {
      locationPermissionGranted = (
        await Location.requestForegroundPermissionsAsync()
      ).granted;
    }
    watchPositionIfNeeded();
  });

  draftObservationStore.subscribe(storeState => {
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
    const currentDraft = draftObservationStore.getState().value;
    if (!currentDraft) return;

    const isStale =
      Date.now() - location.timestamp > STALE_LOCATION_THRESHOLD_MS;
    if (isStale) return;

    const currentDraftCoords = currentDraft.metadata?.position?.coords;

    // TODO: we should use the first location of the draft as the reference
    // point, and use the accuracy of that point as the distance threshold
    const hasMovedAway =
      currentDraftCoords &&
      distanceBetweenCoords(currentDraftCoords, location.coords) > 50;
    if (hasMovedAway) return;

    const isMoreAccurate =
      !currentDraftCoords ||
      !location.coords.accuracy ||
      !currentDraftCoords.accuracy ||
      location.coords.accuracy < currentDraftCoords.accuracy;

    if (!isMoreAccurate) return;

    draftObservationStore.getState().actions.updateObservationPosition({
      manualLocation: false,
      position: location,
    });
  }
}

function isNewlyCreatedDraft(storeState: DraftObservationStoreState) {
  const isObservationInStore = !!storeState.value;
  const isNewlyCreatedObservation = !storeState.observationId;
  return isObservationInStore && isNewlyCreatedObservation;
}

function distanceBetweenCoords(
  a: Location.LocationObjectCoords,
  b: Location.LocationObjectCoords,
) {
  const ruler = new CheapRuler(a.latitude);
  return ruler.distance([a.longitude, a.latitude], [b.longitude, b.latitude]);
}
