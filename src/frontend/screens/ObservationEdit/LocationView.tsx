import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import Location from '../../images/Location.svg';
import {BLACK} from '../../lib/styles';

import {useMostAccurateLocationForObservation} from './useMostAccurateLocationForObservation';
import {FormattedCoords} from '../../sharedComponents/FormattedData';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {usePersistedSettings} from '../../hooks/persistedState/usePersistedSettings';
import {Divider} from '../../sharedComponents/Divider';

const m = defineMessages({
  searching: {
    id: 'screens.ObservationEdit.ObservationEditView.searching',
    defaultMessage: 'Searching…',
    description: 'Shown in new observation screen whilst looking for GPS',
  },
});

export const LocationView = () => {
  const liveLocation = useMostAccurateLocationForObservation();
  const observationValue = usePersistedDraftObservation(
    observationValueSelector,
  );
  const coordinateFormat = usePersistedSettings(coordinateFormatSelector);

  const coordinateInfo = observationValue?.metadata.manualLocation
    ? {
        lat: observationValue.lat,
        lon: observationValue.lon,
        accuracy: liveLocation?.coords?.accuracy,
      }
    : {
        lat: liveLocation?.coords?.latitude,
        lon: liveLocation?.coords?.longitude,
        accuracy: liveLocation?.coords?.accuracy,
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
            {coordinateInfo.accuracy === undefined ? null : (
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
