import * as React from 'react';

import {StoreApi, useStore} from 'zustand';
import CheapRuler from 'cheap-ruler';
import * as Location from 'expo-location';
import {
  DraftState,
  DraftObservationStore,
  convertPosition,
} from './PersistedStores/DraftObservationStore.ts';
import {useLocationContext} from './LocationContext.tsx';
import {LocationState} from './PersistedStores/LocationStore.ts';

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

/** `draftObservationStore` should be initialized outside of react life cycle there will be a stable value */
// eslint-disable-next-line @eslint-react/no-unstable-context-value
export const DraftObservationProvider = ({
  children,
  draftObservationStore,
}: DraftObservationProviderProps) => {
  const locationStore = useLocationContext();
  useCreateDraftObservationLocationUpdator(
    draftObservationStore,
    locationStore,
  );
  return (
    <DraftObservationContext.Provider value={draftObservationStore}>
      {children}
    </DraftObservationContext.Provider>
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

function useCreateDraftObservationLocationUpdator(
  draftObservationStore: DraftObservationStore,
  locationStore: StoreApi<LocationState>,
) {
  React.useEffect(() => {
    let locationSubscription: (() => void) | null = null;
    let storeStateSubscription: (() => void) | null = null;

    if (storeStateSubscription) return;

    draftObservationStore.instance.subscribe(storeState => {
      const isNewlyCreatedDraftInStore = isNewlyCreatedDraft(storeState);
      if (isNewlyCreatedDraftInStore && !locationSubscription) {
        locationSubscription = locationStore.subscribe(locationState => {
          const {value: currentDraft, initialPosition} =
            draftObservationStore.instance.getState();

          if (!currentDraft) {
            // should not get here, re: isNewlyCreatedDraftInStore above
            return;
          }

          const location = locationState.location;

          if (!location) return;
          // if the permission is not granted, there should be no new location. Therefore this location being returned here is stale
          if (locationState.locationPermission !== 'granted') return;

          const providerStatus = locationState.providerStatus;

          // if location services is not enabled, the location is stale
          if (!providerStatus?.locationServicesEnabled) return;

          // If manual location, do not update
          if (
            draftObservationStore.instance.getState().value?.metadata
              ?.manualLocation
          )
            return;

          // if no initial position, set initial position
          if (!initialPosition) {
            draftObservationStore.instance.setState(prev => {
              {
                if (!prev.value) return prev;
                return {...prev, initialPosition: convertPosition(location)};
              }
            });
          }

          onPositionUpdate({
            draftObservationStore,
            location: location,
            positionProvider: providerStatus,
          });
        });
      } else if (!isNewlyCreatedDraftInStore && locationSubscription) {
        locationSubscription();
        locationSubscription = null;
      }
    });

    return () => {
      if (storeStateSubscription) {
        storeStateSubscription();
        storeStateSubscription = null;
      }
      if (locationSubscription) {
        locationSubscription();
        locationSubscription = null;
      }
    };
  }, [draftObservationStore, locationStore]);
}

function onPositionUpdate({
  location,
  positionProvider,
  draftObservationStore,
}: {
  location: Location.LocationObject;
  positionProvider: Location.LocationProviderStatus;
  draftObservationStore: DraftObservationStore;
}) {
  const {value: currentDraft, initialPosition} =
    draftObservationStore.instance.getState();

  if (!currentDraft) return;

  const isStale = Date.now() - location.timestamp > STALE_LOCATION_THRESHOLD_MS;
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
    positionProvider,
  });
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
