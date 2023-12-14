import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BLACK, LIGHT_GREY} from '../../lib/styles';
import {convertToUTM} from '../../lib/utils';

import {useMostAccurateLocationForObservation} from './useMostAccurateLocationForObservation';

const m = defineMessages({
  searching: {
    id: 'screens.ObservationEdit.ObservationEditView.searching',
    defaultMessage: 'Searching…',
    description: 'Shown in new observation screen whilst looking for GPS',
  },
});

export const LocationView = () => {
  const location = useMostAccurateLocationForObservation();

  const lat =
    !location || !location.coords ? undefined : location.coords.latitude;
  const lon =
    !location || !location.coords ? undefined : location.coords.longitude;
  const accuracy =
    !location || !location.coords ? undefined : location.coords.accuracy;

  return (
    <View style={styles.locationContainer}>
      {!lat || !lon ? (
        <Text>
          <FormattedMessage {...m.searching} />
        </Text>
      ) : (
        <React.Fragment>
          <MaterialIcons
            size={14}
            name="location-on"
            color="orange"
            style={{marginRight: 5}}
          />
          <Text style={styles.locationText}>
            {
              // This needs to be changed to a formatted coord eventually
              convertToUTM({lat, lon})
            }
          </Text>
          {!accuracy ? null : (
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
