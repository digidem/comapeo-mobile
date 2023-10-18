import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DeviceMobile from '../images/DeviceMobile.svg';
import DeviceDesktop from '../images/DeviceDesktop.svg';
import {DeviceType, ViewStyleProp} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {BLACK} from '../lib/styles';

const m = defineMessages({
  thisDevice: {
    id: 'sharedComponents.DeviceIconWithName.thisDevice',
    defaultMessage: 'This Device!',
  },
});

type DeviceNameWithIconProps = {
  deviceType: DeviceType;
  name: string;
  deviceId?: string;
  thisDevice?: boolean;
  iconSize?: number;
  style?: ViewStyleProp;
};

export const DeviceNameWithIcon = ({
  deviceType,
  name,
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
        <Text style={{fontWeight: 'bold', color: BLACK}}>{name}</Text>
        {deviceId && <Text>{deviceId}</Text>}
        {thisDevice && <Text>{formatMessage(m.thisDevice)}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
