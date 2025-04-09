import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {DARK_GREY, WHITE} from '../lib/styles';
import {GpsErrorIcon, GpsSearchingIcon, GpsGoodIcon} from './icons';
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

  const {status, accuracy} = getLocationStatus({
    location: fgPermissions ? locationState.location : undefined,
    providerStatus: locationProviderStatus,
  });

  let textValue: string;
  let IconToRender: React.FC;

  switch (status) {
    case 'error':
      textValue = formatMessage(m.noGps);
      IconToRender = GpsErrorIcon;
      break;
    case 'searching':
      textValue = formatMessage(m.searching);
      IconToRender = GpsSearchingIcon;
      break;
    case 'good': {
      const roundedAcc = accuracy ? Math.round(accuracy) : 9999;
      textValue = `± ${roundedAcc} m`;
      IconToRender = GpsGoodIcon;
      break;
    }
    default:
      textValue = formatMessage(m.searching);
      IconToRender = GpsSearchingIcon;
      break;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      testID="MAP.gps-pill"
      accessibilityLabel="Open GPS Modal">
      <IconToRender />

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
    maxWidth: 96,
    minHeight: 32,
    backgroundColor: DARK_GREY,
    borderRadius: 20,
    paddingHorizontal: 10,
    gap: 5,
    flexShrink: 1,
    overflow: 'hidden',
  },
  text: {
    color: WHITE,
  },
});
