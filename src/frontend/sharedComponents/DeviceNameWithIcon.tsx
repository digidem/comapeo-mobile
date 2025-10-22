import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import ShieldIcon from '../images/BlackShield.svg';
import type {
  ViewStyleProp,
  DeviceConnectionStatus,
  DeviceType,
} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {DARK_GREY, LIGHT_GREY, MEDIUM_GREY} from '../lib/styles';
import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import Caution from '../images/caution.svg';
import {HeaderText} from './Text/HeaderText';
import {BodyText} from './Text/BodyText';

const m = defineMessages({
  thisDevice: {
    id: 'sharedComponents.DeviceIconWithName.thisDevice',
    defaultMessage: 'This Device!',
  },
  disconnected: {
    id: 'sharedComponents.DeviceIconWithName.Disconnected',
    defaultMessage: 'Disconnected',
  },
});

type DeviceNameWithIconProps = {
  deviceType: DeviceType | undefined;
  name: string;
  deviceId?: string;
  thisDevice?: boolean;
  iconSize?: number;
  style?: ViewStyleProp;
  deviceConnectionStatus?: DeviceConnectionStatus;
};

export const DeviceNameWithIcon = ({
  deviceType,
  name,
  deviceConnectionStatus,
  deviceId,
  thisDevice,
  iconSize,
  style,
}: DeviceNameWithIconProps) => {
  const {formatMessage} = useIntl();

  let isDisconnected: boolean;
  switch (deviceConnectionStatus) {
    case undefined:
    case 'connected':
      isDisconnected = false;
      break;
    case 'disconnected':
      isDisconnected = true;
      break;
    default:
      throw new ExhaustivenessError(deviceConnectionStatus);
  }

  const size = iconSize || 35;

  return (
    <View style={[styles.flexRow, style]}>
      <DeviceIcon deviceType={deviceType} size={size} />
      <View style={{marginLeft: 10, flex: 1}}>
        <HeaderText variant="header6">{name}</HeaderText>
        {deviceId && (
          <BodyText
            style={{color: MEDIUM_GREY, overflow: 'hidden', flexShrink: 1}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {`${deviceId.slice(0, 12)}...`}
          </BodyText>
        )}
        {thisDevice && (
          <BodyText
            variant="smallMeta"
            style={{flex: 1, color: MEDIUM_GREY}}
            numberOfLines={1}>
            {formatMessage(m.thisDevice)}
          </BodyText>
        )}
        {isDisconnected && (
          <View style={[styles.flexRow, {marginTop: 4.4}]}>
            <Caution />
            <BodyText variant="tinyMeta" style={styles.deviceStatusText}>
              {formatMessage(m.disconnected)}
            </BodyText>
          </View>
        )}
      </View>
    </View>
  );
};

const DeviceIcon = ({
  deviceType,
  size,
}: {
  deviceType: DeviceType | undefined;
  size: number;
}) => {
  switch (deviceType) {
    case 'mobile':
      return (
        <DeviceIconBackground size={size}>
          <MaterialIcons
            name="smartphone"
            size={size * 0.5}
            color={DARK_GREY}
          />
        </DeviceIconBackground>
      );
    case 'tablet':
      return (
        <DeviceIconBackground size={size}>
          <MaterialIcons
            name="tablet-android"
            size={size * 0.5}
            color={DARK_GREY}
          />
        </DeviceIconBackground>
      );
    case 'desktop':
      return (
        <DeviceIconBackground size={size}>
          <MaterialIcons name="computer" size={size * 0.5} color={DARK_GREY} />
        </DeviceIconBackground>
      );
    case 'selfHostedServer':
      return (
        <DeviceIconBackground size={size}>
          <ShieldIcon width={size * 0.5} height={size * 0.7} />
        </DeviceIconBackground>
      );
    case undefined:
    case 'UNRECOGNIZED':
    case 'device_type_unspecified':
    default: {
      return (
        <DeviceIconBackground size={size}>
          <MaterialIcons
            name="help-outline"
            size={size * 0.5}
            color={DARK_GREY}
          />
        </DeviceIconBackground>
      );
    }
  }
};

const DeviceIconBackground = ({
  children,
  size,
}: {
  children: React.ReactNode;
  size: number;
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: LIGHT_GREY,
        borderRadius: size / 2,
        width: size,
        height: size,
      }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStatusText: {
    flex: 1,
    color: MEDIUM_GREY,
    marginLeft: 5,
  },
});
