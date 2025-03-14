import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BLACK, WHITE} from '../lib/styles';
import {useLocation} from '../hooks/useLocation';
import {useLocationProviderStatus} from '../contexts/LocationProviderStatusContext';
import {HeaderText} from './Text/HeaderText';
import {useNavigationFromHomeTabs} from '../hooks/useNavigationWithTypes';
import {ErrorIcon, GpsIcon} from './icons/GpsIcon';

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
  const {formatMessage: t} = useIntl();
  const {navigate} = useNavigationFromHomeTabs();
  const {location, error} = useLocation({maxDistanceInterval: 0});
  const locationProviderStatus = useLocationProviderStatus();

  const pillStatus = determinePillStatus({
    locationServicesEnabled: locationProviderStatus?.locationServicesEnabled,
    timestamp: location?.timestamp,
    accuracy: location?.coords.accuracy,
    error,
  });

  return (
    <TouchableOpacity
      onPress={() => navigate('GpsModal')}
      testID="MAIN.gps-pill-btn">
      <View
        style={[
          styles.container,
          pillStatus.status === 'error' ? styles.error : undefined,
        ]}>
        {pillStatus.status === 'error' ? (
          <>
            <ErrorIcon />
            <HeaderText style={styles.text} variant="header5">
              {t(m.noGps)}
            </HeaderText>
          </>
        ) : pillStatus.status === 'searching' ? (
          <>
            <GpsIcon color="#0166FF" />
            <HeaderText style={styles.text} variant="header5">
              {t(m.searching)}
            </HeaderText>
          </>
        ) : (
          <>
            <GpsIcon color="#00FF02" />
            <HeaderText
              style={styles.text}
              variant="header5">{`± ${Math.round(pillStatus.accuracy)} m`}</HeaderText>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const STALE_TIMEOUT = 60 * 1000;

function determinePillStatus({
  locationServicesEnabled,
  error,
  accuracy,
  timestamp,
}: {
  locationServicesEnabled?: boolean;
  error?: Error;
  accuracy?: number | null;
  timestamp?: number;
}):
  | {status: 'error'}
  | {status: 'searching'}
  | {status: 'hasValidAccuracy'; accuracy: number} {
  if (error || !locationServicesEnabled) {
    return {status: 'error'};
  }

  if (!accuracy || !timestamp) {
    return {status: 'searching'};
  }

  const positionStale = Date.now() - timestamp > STALE_TIMEOUT;

  if (positionStale) {
    return {status: 'searching'};
  }

  return {status: 'hasValidAccuracy', accuracy};
}

const styles = StyleSheet.create({
  container: {
    minWidth: 100,
    borderRadius: 18,
    height: 36,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: '#33333366',
    backgroundColor: BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  error: {backgroundColor: '#FF0000'},
  text: {color: WHITE, marginLeft: 5},
});
