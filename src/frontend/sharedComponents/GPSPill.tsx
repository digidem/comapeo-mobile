import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {DARK_GREY, WHITE} from '../lib/styles';
import {GpsErrorIcon, GpsSearchingIcon, GpsGoodIcon} from './icons';
import {useSharedLocationContext} from '../contexts/SharedLocationContext';
import {getLocationStatus} from '../lib/utils';
import {BodyText} from './Text/BodyText';
import {UIActivityIndicator} from 'react-native-indicators';
import type {LocationProviderStatus} from 'expo-location';

type GPSPillProps = {
  onPress?: () => void;
  locationProviderStatus?: LocationProviderStatus;
};

export const GPSPill: FC<GPSPillProps> = ({
  onPress,
  locationProviderStatus,
}) => {
  const {locationState, fgPermissions} = useSharedLocationContext();

  const locationStatus = getLocationStatus({
    location: fgPermissions ? locationState.location : undefined,
    providerStatus: locationProviderStatus,
  });

  let textValue: string | React.ReactNode;
  let IconToRender: React.FC;

  switch (locationStatus.status) {
    case 'error':
      textValue = '--';
      IconToRender = GpsErrorIcon;
      break;
    case 'searching':
      textValue = <UIActivityIndicator size={20} color={WHITE} />;
      IconToRender = GpsSearchingIcon;
      break;
    case 'good': {
      textValue = `± ${Math.round(locationStatus.accuracy)} m`;
      IconToRender = GpsGoodIcon;
      break;
    }
    default:
      textValue = <UIActivityIndicator size={20} color={WHITE} />;
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

      <BodyText
        variant="smallMeta"
        style={styles.text}
        numberOfLines={1}
        testID="MAP.gps-pill-text">
        {textValue}
      </BodyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
    marginBottom: 2,
  },
});
