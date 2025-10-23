import React from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import ShieldIcon from '../images/BlackShield.svg';
import type {DeviceType} from '../sharedTypes';
import {DARK_GREY, BLUE_GREY} from '../lib/styles';

type DeviceIconProps = {
  deviceType: DeviceType | undefined;
  size?: number;
  iconColor?: string;
};

export const DeviceIcon = ({
  deviceType,
  size = 35,
  iconColor = DARK_GREY,
}: DeviceIconProps) => {
  const iconSize = size * 0.5;

  const getIconContent = () => {
    switch (deviceType) {
      case 'mobile':
        return (
          <MaterialIcons name="smartphone" size={iconSize} color={iconColor} />
        );
      case 'tablet':
        return (
          <MaterialIcons
            name="tablet-android"
            size={iconSize}
            color={iconColor}
          />
        );
      case 'desktop':
        return (
          <MaterialIcons name="computer" size={iconSize} color={iconColor} />
        );
      case 'selfHostedServer':
        return <ShieldIcon width={iconSize} height={size * 0.7} />;
      case undefined:
      case 'UNRECOGNIZED':
      case 'device_type_unspecified':
      default:
        return (
          <MaterialIcons
            name="help-outline"
            size={iconSize}
            color={iconColor}
          />
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}>
      {getIconContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE_GREY,
  },
});
