import * as React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {BLACK, COMAPEO_BLUE, LIGHT_GREY} from '../../lib/styles';
import {Divider} from '../Divider';
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

export const PresetAndLocationView = ({
  onPressPreset,
  presetName,
  PresetIcon,
  location,
}: PresetViewProps & {location?: LocationViewProps}) => {
  return (
    <View style={styles.container}>
      <PresetView
        onPressPreset={onPressPreset}
        presetName={presetName}
        PresetIcon={PresetIcon}
      />
      {location && <LocationView {...location} />}
    </View>
  );
};

type PresetViewProps = {
  onPressPreset?: () => void;
  presetName: string;
  PresetIcon: React.ReactNode;
};

const PresetView = ({
  onPressPreset,
  presetName,
  PresetIcon,
}: PresetViewProps) => {
  return (
    <TouchableOpacity
      disabled={!onPressPreset}
      onPress={onPressPreset}
      style={styles.preset}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {PresetIcon}
        <Text style={styles.categoryName}>{presetName}</Text>
      </View>
      <Text style={styles.changeButtonText}>Change</Text>
    </TouchableOpacity>
  );
};

type LocationViewProps = {
  lat: number | undefined;
  lon: number | undefined;
  accuracy: number | undefined;
};

const LocationView = ({lat, lon, accuracy}: LocationViewProps) => {
  const coordinateFormat = usePersistedSettings(
    store => store.coordinateFormat,
  );
  return (
    <>
      <Divider />
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
    </>
  );
};

const styles = StyleSheet.create({
  changeButtonText: {
    color: COMAPEO_BLUE,
    fontSize: 14,
    fontWeight: '500',
  },
  preset: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: BLACK,
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    margin: 20,
  },
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
