import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BLACK, LIGHT_GREY} from '../../lib/styles';
import {Position, useLocationContext} from '../../contexts/LocationContext';
import {convertToUTM} from '../../lib/utils';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {PermissionResult} from '../../contexts/PermissionsContext';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';

const m = defineMessages({
  searching: {
    id: 'screens.ObservationEdit.ObservationEditView.searching',
    defaultMessage: 'Searching…',
    description: 'Shown in new observation screen whilst looking for GPS',
  },
});

export const LocationView = () => {
  const value = usePersistedDraftObservation(store => store.value);
  const draftHasManualLocation =
    value && value.metadata && value.metadata.manualLocation;

  if (!draftHasManualLocation) {
    // this component will update the location
    return <LocationViewMemoized />;
  }

  // this component will stop updating the location (because the user has typed in a manual location)
  return <LocationViewStatic />;
};

type LocationTextProps = {
  lat?: number | null;
  lon?: number | null;
  accuracy?: number | null;
};

const LocationText = ({lat, lon, accuracy}: LocationTextProps) => {
  // const format = useSettingsValue("coordinateFormat");
  return (
    <View style={styles.locationContainer}>
      {!lat || !lon ? (
        <Text>
          <FormattedMessage {...m.searching} />
        </Text>
      ) : (
        <>
          <MaterialIcons
            size={14}
            name="location-on"
            color="orange"
            style={{marginRight: 5}}
          />
          <Text style={styles.locationText}>
            {
              // This needs to be changed to a formatted coor eventually
              convertToUTM({lat, lon})
            }
          </Text>
          {!accuracy ? null : (
            <Text style={styles.accuracy}>
              {' ±' + accuracy.toFixed(2) + 'm'}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

type LocationViewMemoizedProps = {
  position?: Position;
  permission?: PermissionResult;
  error?: boolean;
};
const LocationViewMemoizedInner = React.memo<LocationViewMemoizedProps>(
  ({position, permission, error}) => {
    const {updatePosition} = useDraftObservation();

    updatePosition({position, permissionResult: permission, error});

    return (
      <LocationText
        lat={position?.coords.latitude}
        lon={position?.coords.longitude}
        accuracy={position?.coords.accuracy}
      />
    );
  },
  shouldUpdateComponentBasedOnAccuracy,
);

const LocationViewMemoized = () => {
  const {position, permission, error} = useLocationContext();

  return (
    <LocationViewMemoizedInner
      position={position}
      permission={permission}
      error={error}
    />
  );
};

function shouldUpdateComponentBasedOnAccuracy(
  prevProps: LocationViewMemoizedProps,
  nextProps: LocationViewMemoizedProps,
) {
  if (prevProps.error !== nextProps.error) return true;

  if (prevProps.permission !== nextProps.permission) return true;

  // if there is no position or accuracy, do not rerender
  if (!nextProps.position || !nextProps.position.coords.accuracy) return false;

  // if there was previously no position.coords.accuracy and there is now, do re-render
  if (
    (!prevProps.position || !prevProps.position.coords.accuracy) &&
    nextProps.position.coords.accuracy
  )
    return true;

  // if accuracy has increased rerender
  if (
    prevProps.position &&
    prevProps.position.coords.accuracy &&
    nextProps.position.coords.accuracy < prevProps.position.coords.accuracy
  )
    return true;

  return false;
}

const LocationViewStatic = () => {
  const value = usePersistedDraftObservation(store => store.value);
  if (!value)
    throw new Error(
      'Cannot use LocationViewStatic is there is no exisiting observation saved in draft observation',
    );

  return (
    <LocationText
      lat={value.lat}
      lon={value.lon}
      accuracy={value.metadata?.accuracy}
    />
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    flex: 0,
    backgroundColor: LIGHT_GREY,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  locationText: {
    color: BLACK,
    fontWeight: 'bold',
  },
  accuracy: {
    fontWeight: 'bold',
  },
});
