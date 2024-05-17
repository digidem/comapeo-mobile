import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import DeviceMobile from '../images/DeviceMobile.svg';
import DeviceDesktop from '../images/DeviceDesktop.svg';
import {ViewStyleProp} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from './Text';
import {MEDIUM_GREY} from '../lib/styles';
import {DeviceType} from '../sharedTypes';
import Caution from '../images/caution.svg';

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
  deviceType: DeviceType;
  name: string;
  deviceId?: string;
  thisDevice?: boolean;
  iconSize?: number;
  style?: ViewStyleProp;
  isConnected?: boolean;
};

export const DeviceNameWithIcon = ({
  deviceType,
  name,
  isConnected,
  deviceId,
  thisDevice,
  iconSize,
  style,
}: DeviceNameWithIconProps) => {
  const {formatMessage} = useIntl();
  return (
    <View style={[styles.flexRow, style]}>
      {deviceType === 'mobile' ? (
        <DeviceMobile width={iconSize || 35} height={iconSize || 35} />
      ) : (
        <DeviceDesktop width={iconSize || 35} height={iconSize || 35} />
      )}
      <View style={{marginLeft: 10}}>
        <Text style={{fontWeight: 'bold'}}>{name}</Text>
        {deviceId && (
          <Text style={{color: MEDIUM_GREY}} numberOfLines={1}>
            {`${deviceId.slice(0, 12)}...`}
          </Text>
        )}
        {thisDevice && (
          <Text style={{flex: 1, color: MEDIUM_GREY}}>
            {formatMessage(m.thisDevice)}
          </Text>
        )}
        {isConnected && (
          <View style={[styles.flexRow, {marginTop: 4.4}]}>
            <Caution />
            <Text style={styles.deviceStatusText}>
              {formatMessage(m.disconnected)}
            </Text>
          </View>
        )}
      </View>
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
    fontSize: 12,
    color: MEDIUM_GREY,
    marginLeft: 5,
  },
});
