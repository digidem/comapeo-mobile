import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BLACK, LIGHT_GREY} from '../../lib/styles';
import {useLocationContext} from '../../contexts/LocationContext';
import {convertToUTM} from '../../lib/utils';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {Position} from '../../sharedTypes';

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

  if (draftHasManualLocation) {
    // this component will stop updating the location (because the user has typed in a manual location)
    return <LocationViewStatic />;
  }

  return <LocationViewMemoized />;
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
};
const LocationViewMemoizedInner = React.memo<LocationViewMemoizedProps>(
  ({position}) => {
    const {updateObservationPosition} = useDraftObservation();

    updateObservationPosition({position, manualLocation: false});

    return (
      <LocationText
        lat={position && position.coords ? position.coords.latitude : undefined}
        lon={
          position && position.coords ? position.coords.longitude : undefined
        }
        accuracy={
          position && position.coords ? position?.coords.accuracy : undefined
        }
      />
    );
  },
  shouldComponentIgnoreRerender,
);

const LocationViewMemoized = () => {
  const {position} = useLocationContext();

  return <LocationViewMemoizedInner position={position} />;
};

function shouldComponentIgnoreRerender(
  prevProps: LocationViewMemoizedProps,
  nextProps: LocationViewMemoizedProps,
) {
  // if there is no position or accuracy, do not rerender
  if (
    !nextProps.position ||
    !nextProps.position.coords ||
    !nextProps.position.coords.accuracy
  )
    return true;

  // if there was previously no accuracy and there is now, do re-render
  if (
    (!prevProps.position ||
      !prevProps.position.coords ||
      !prevProps.position.coords.accuracy) &&
    nextProps.position.coords.accuracy
  )
    return false;

  // if accuracy has increased rerender
  if (
    prevProps.position &&
    prevProps.position.coords &&
    prevProps.position.coords.accuracy &&
    nextProps.position.coords.accuracy < prevProps.position.coords.accuracy
  )
    return false;

  return true;
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
      accuracy={
        value.metadata.position &&
        value.metadata.position.coords &&
        value.metadata.position.coords.accuracy
          ? value.metadata.position.coords.accuracy
          : undefined
      }
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
