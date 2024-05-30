import React, {useEffect} from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import Location from '../../images/Location.svg';
import {BLACK} from '../../lib/styles';

import {FormattedCoords} from '../../sharedComponents/FormattedData';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {usePersistedSettings} from '../../hooks/persistedState/usePersistedSettings';
import {useLocation} from '../../hooks/useLocation';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {useLocationProviderStatus} from '../../hooks/useLocationProviderStatus';

const m = defineMessages({
  searching: {
    id: 'screens.ObservationEdit.ObservationEditView.searching',
    defaultMessage: 'Searching…',
    description: 'Shown in new observation screen whilst looking for GPS',
  },
});

export const LocationView = () => {
  const observationValue = usePersistedDraftObservation(store => store.value);

  return observationValue?.metadata.manualLocation ? (
    <LocationViewManualPosition />
  ) : (
    <LocationViewUpdatePosition />
  );
};

const LocationViewManualPosition = () => {
  const observationValue = usePersistedDraftObservation(store => store.value);
  return (
    <LocationViewInner
      lat={observationValue?.lat}
      lon={observationValue?.lon}
      accuracy={null}
    />
  );
};

const LocationViewUpdatePosition = () => {
  const observationValue = usePersistedDraftObservation(store => store.value);
  //only update the location if the accuracy increases OR the user has moved outside of the accuracy's radius of uncertainty.
  const {location} = useLocation(
    ({accuracy}) => accuracy === 'better' || accuracy === 'stale',
  );
  const {updateObservationPosition} = useDraftObservation();
  const locationProviderStatus = useLocationProviderStatus();
  const locationServicesEnabled =
    !!locationProviderStatus?.locationServicesEnabled;

  useEffect(() => {
    const newCoord = !location
      ? undefined
      : Object.entries(location.coords).map(
          ([key, val]) => [key, val === null ? undefined : val] as const,
        );

    updateObservationPosition({
      position: {
        mocked: false,
        coords:
          // We do not want to serve a stale position. So show coordinates as undefined if location services is not enabled.
          !newCoord || !locationServicesEnabled
            ? undefined
            : Object.fromEntries(newCoord),
        timestamp: location?.timestamp.toString(),
      },
      manualLocation: false,
    });
  }, [location, updateObservationPosition, locationServicesEnabled]);

  return (
    <LocationViewInner
      lat={observationValue?.lat}
      lon={observationValue?.lon}
      accuracy={location?.coords.accuracy}
    />
  );
};

const LocationViewInner = ({
  lat,
  lon,
  accuracy,
}: {
  lat: number | undefined;
  lon: number | undefined;
  accuracy: number | undefined | null;
}) => {
  const coordinateFormat = usePersistedSettings(
    store => store.coordinateFormat,
  );

  return (
    <View style={styles.locationContainer}>
      {lat === undefined || lon === undefined ? (
        <Text>
          <FormattedMessage {...m.searching} />
        </Text>
      ) : (
        <React.Fragment>
          <Location style={{marginRight: 10}} />
          <Text style={styles.locationText}>
            <FormattedCoords format={coordinateFormat} lat={lat} lon={lon} />
          </Text>
          {typeof accuracy === 'number' && (
            <Text style={styles.accuracy}>
              {' ±' + accuracy.toFixed(2) + 'm'}
            </Text>
          )}
        </React.Fragment>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 13,
  },
  locationText: {
    color: BLACK,
    fontSize: 12,
  },
  accuracy: {
    color: BLACK,
    fontSize: 12,
  },
});
