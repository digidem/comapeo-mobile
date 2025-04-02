import React, {FC, useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {DARK_GREY, WHITE} from '../lib/styles';
import {GpsIcon} from './icons/GpsIcon';
import {useSharedLocationContext} from '../contexts/SharedLocationContext';
import {useLocationProviderStatus} from '../hooks/useLocationProviderStatus';
import {getLocationStatus} from '../lib/utils';
import {BodyText} from './Text/BodyText';

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

type GPSPillProps = {
  onPress?: () => void;
};

export const GPSPill: FC<GPSPillProps> = ({onPress}) => {
  const {formatMessage} = useIntl();
  const locationProviderStatus = useLocationProviderStatus();
  const {locationState, fgPermissions} = useSharedLocationContext();

  const status = useMemo(() => {
    const isError = !!locationState.error || !fgPermissions;
    if (isError) return 'error';

    return getLocationStatus({
      location: locationState.location,
      providerStatus: locationProviderStatus,
    });
  }, [locationState, fgPermissions, locationProviderStatus]);

  const textValue = useMemo(() => {
    if (status === 'error') {
      return formatMessage(m.noGps);
    }
    if (status === 'searching' || !locationState.location?.coords.accuracy) {
      return formatMessage(m.searching);
    }

    const precision = Math.round(locationState.location.coords.accuracy);
    return `${precision} ±`;
  }, [status, locationState.location, formatMessage]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      testID="MAP.gps-pill"
      accessibilityLabel="Open GPS Modal">
      <GpsIcon variant={status} />

      <BodyText variant="regular" style={styles.text} numberOfLines={1}>
        {textValue}
      </BodyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 68,
    minHeight: 32,
    backgroundColor: DARK_GREY,
    borderRadius: 20,
    paddingHorizontal: 10,
    gap: 5,
  },
  text: {
    color: WHITE,
  },
});
