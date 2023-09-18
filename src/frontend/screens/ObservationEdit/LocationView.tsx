import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BLACK, LIGHT_GREY} from '../../lib/styles';

const m = defineMessages({
  searching: {
    id: 'screens.ObservationEdit.ObservationEditView.searching',
    defaultMessage: 'Searching…',
    description: 'Shown in new observation screen whilst looking for GPS',
  },
});

export const LocationView = ({
  longitude,
  latitude,
  accuracy,
}: {
  longitude?: number | null;
  latitude?: number | null;
  accuracy?: number;
}) => {
  // const format = useSettingsValue("coordinateFormat");
  return (
    <View style={styles.locationContainer}>
      {longitude == null || latitude == null ? (
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
          {/* <Text style={styles.locationText}>
              <FormattedCoords format={format} lat={latitude} lon={longitude} />
            </Text> */}
          {accuracy === undefined ? null : (
            <Text style={styles.accuracy}>
              {' ±' + accuracy.toFixed(2) + 'm'}
            </Text>
          )}
        </>
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
