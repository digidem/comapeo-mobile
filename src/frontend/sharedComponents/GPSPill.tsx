import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './Text';
import {useIsFocused} from '@react-navigation/native';
import {useLocationProviderStatus} from '../hooks/useLocationProviderStatus';
import {getLocationStatus} from '../lib/utils';
import {defineMessages, useIntl} from 'react-intl';
import {GpsIcon} from './icons';
import {useSharedLocationContext} from '../contexts/SharedLocationContext';
import {BLACK, WHITE} from '../lib/styles';

const m = defineMessages({
  noGps: {
    id: 'sharedComponents.GpsPill.noGps',
    defaultMessage: 'No GPS',
  },
  searching: {
    id: 'sharedComponents.GpsPill.searching',
    defaultMessage: 'Searching…',
  },
});

export const GPSPill = ({navigation}) => {
  const isFocused = useIsFocused();
  const {formatMessage: t} = useIntl();
  const {locationState, fgPermissions} = useSharedLocationContext();
  const locationProviderStatus = useLocationProviderStatus();

  const precision = locationState?.location?.coords.accuracy;

  const status = useMemo(() => {
    const isError = !!locationState.error || !fgPermissions;

    return isError
      ? 'error'
      : getLocationStatus({
          location: locationState.location,
          providerStatus: locationProviderStatus,
        });
  }, [
    locationProviderStatus,
    locationState.error,
    locationState.location,
    fgPermissions,
  ]);

  const text = useMemo(() => {
    if (status === 'error') return t(m.noGps);
    else if (status === 'searching' || typeof precision === 'undefined') {
      return t(m.searching);
    } else return `± ${Math.round(precision!)} m`;
  }, [precision, status, t]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('GPSModal' as never)}
      testID="gpsPillButton">
      <View
        style={[
          styles.container,
          status === 'error' ? styles.error : undefined,
        ]}>
        <View style={styles.icon}>
          {isFocused && <GpsIcon variant={status} />}
        </View>
        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    minWidth: 100,
    maxWidth: 200,
    borderRadius: 18,
    height: 36,
    paddingLeft: 32,
    paddingRight: 20,
    borderWidth: 3,
    borderColor: '#33333366',
    backgroundColor: BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  error: {backgroundColor: '#FF0000'},
  text: {color: WHITE},
  icon: {position: 'absolute', left: 6},
});
