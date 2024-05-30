import React, {useEffect} from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import Location from '../../images/Location.svg';
import {BLACK} from '../../lib/styles';

import {FormattedCoords} from '../../sharedComponents/FormattedData';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {usePersistedSettings} from '../../hooks/persistedState/usePersistedSettings';
import {Divider} from '../../sharedComponents/Divider';
import {useLocation} from '../../hooks/useLocation';
import {useDraftObservation} from '../../hooks/useDraftObservation';

const m = defineMessages({
  searching: {
    id: 'screens.ObservationEdit.ObservationEditView.searching',
    defaultMessage: 'Searching…',
    description: 'Shown in new observation screen whilst looking for GPS',
  },
});

export const LocationView = () => {
  const observationValue = usePersistedDraftObservation(
    observationValueSelector,
  );
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const {location} = useLocation(({accuracy}) => {
    // if an observationId exists, the user is editting and already save observation so we do not want to update
    // if the manual location has been set, we also do not want to update
    if (observationId || observationValue?.metadata.manualLocation)
      return false;
    return accuracy === 'better';
  });
  const coordinateFormat = usePersistedSettings(coordinateFormatSelector);
  const {updateObservationPosition} = useDraftObservation();

  useEffect(() => {
    const newCoord = !location
      ? undefined
      : Object.entries(location.coords).map(
          ([key, val]) => [key, val === null ? undefined : val] as const,
        );

    updateObservationPosition({
      position: {
        mocked: false,
        coords: !newCoord ? undefined : Object.fromEntries(newCoord),
        timestamp: location?.timestamp.toString(),
      },
      manualLocation: false,
    });
  }, [location, updateObservationPosition]);

  const coordinateInfo = observationValue?.metadata.manualLocation
    ? {
        lat: observationValue.lat,
        lon: observationValue.lon,
        accuracy: location?.coords?.accuracy,
      }
    : {
        lat: location?.coords?.latitude,
        lon: location?.coords?.longitude,
        accuracy: location?.coords?.accuracy,
      };

  return (
    <>
      <Divider />
      <View style={styles.locationContainer}>
        {coordinateInfo.lat === undefined ||
        coordinateInfo.lon === undefined ? (
          <Text>
            <FormattedMessage {...m.searching} />
          </Text>
        ) : (
          <React.Fragment>
            <Location style={{marginRight: 10}} />
            <Text style={styles.locationText}>
              <FormattedCoords
                format={coordinateFormat}
                lat={coordinateInfo.lat}
                lon={coordinateInfo.lon}
              />
            </Text>
            {typeof coordinateInfo.accuracy === 'number' && (
              <Text style={styles.accuracy}>
                {' ±' + coordinateInfo.accuracy.toFixed(2) + 'm'}
              </Text>
            )}
          </React.Fragment>
        )}
      </View>
    </>
  );
};

function observationValueSelector(
  state: Parameters<Parameters<typeof usePersistedDraftObservation>[0]>[0],
) {
  return state.value;
}

function coordinateFormatSelector(
  state: Parameters<Parameters<typeof usePersistedSettings>[0]>[0],
) {
  return state.coordinateFormat;
}

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
