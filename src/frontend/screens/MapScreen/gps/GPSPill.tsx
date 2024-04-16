import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '../../../sharedComponents/Text';
import * as Location from 'expo-location';
import {useLocation} from '../../../hooks/useLocation';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes';
import {useIsFocused} from '@react-navigation/native';
import {useLocationProviderStatus} from '../../../hooks/useLocationProviderStatus';
import {getLocationStatus} from '../../../lib/utils';
import {defineMessages, useIntl} from 'react-intl';
import {GpsIcon} from '../../../sharedComponents/icons';

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

export const GPSPill = () => {
  const isFocused = useIsFocused();
  const {formatMessage: t} = useIntl();
  const locationState = useLocation({maxDistanceInterval: 0});
  const [permissions] = Location.useForegroundPermissions();
  const locationProviderStatus = useLocationProviderStatus();

  const precision = locationState.location?.coords.accuracy;

  const status = useMemo(() => {
    const isError = !!locationState.error || !permissions?.granted;

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
    permissions?.granted,
  ]);

  const text = useMemo(() => {
    if (status === 'error') return t(m.noGps);
    else if (status === 'searching' || typeof precision === 'undefined') {
      return t(m.searching);
    } else return `± ${Math.round(precision!)} m`;
  }, [precision, status, t]);

  const navigation = useNavigationFromHomeTabs();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('GpsModal')}>
      <View style={styles.indicatorWrapper}>
        <View style={styles.wrapper}>
          {isFocused && <GpsIcon variant={status} />}
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  indicatorWrapper: {
    backgroundColor: '#333333',
    borderRadius: 20,
    padding: 14.5,
  },
  wrapper: {flexDirection: 'row', alignItems: 'center'},
  text: {marginLeft: 5, color: '#fff', fontSize: 15},
});
