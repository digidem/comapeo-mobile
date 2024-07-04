import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BLACK} from '../../lib/styles';
import {FormattedMessage, defineMessages} from 'react-intl';
import LocationIcon from '../../images/Location.svg';
import {FormattedCoords} from '../FormattedData';
import {usePersistedSettings} from '../../hooks/persistedState/usePersistedSettings';

const m = defineMessages({
  searching: {
    id: 'sharedComponents.EditScreen.PresetAndLocationView.seaching',
    defaultMessage: 'Searching…',
    description: 'Shown in new observation screen whilst looking for GPS',
  },
});

type LocationViewProps = {
  lat: number | undefined;
  lon: number | undefined;
  accuracy: number | undefined;
};

export const LocationView = ({lat, lon, accuracy}: LocationViewProps) => {
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
          <LocationIcon style={{marginRight: 10}} />
          <Text style={styles.locationText}>
            <FormattedCoords format={coordinateFormat} lat={lat} lon={lon} />
          </Text>
          {accuracy === undefined ? null : (
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
    padding: 10,
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
