import React from 'react';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY, RED} from '../lib/styles';
import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import type {
  DeviceConnectionStatus,
  DeviceType,
  ViewStyleProp,
} from '../sharedTypes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';
import {FormattedDate, defineMessages, useIntl} from 'react-intl';
import {Text} from './Text';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';

const m = defineMessages({
  leaveProject: {
    id: 'sharedComponents.DeviceCard.leaveProject',
    defaultMessage: 'Leave Project',
  },
});

type DeviceCardProps = {
  deviceType: DeviceType;
  name: string;
  deviceConnectionStatus?: DeviceConnectionStatus;
  thisDevice?: boolean;
  deviceId?: string;
  dateAdded?: string;
  style?: ViewStyleProp;
  onPress?: () => void;
};

export const DeviceCard = ({
  deviceType,
  name,
  style,
  thisDevice,
  deviceId,
  dateAdded,
  onPress,
  deviceConnectionStatus,
}: DeviceCardProps) => {
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

  const {navigate} = useNavigationFromRoot();
  const {formatMessage} = useIntl();

  return (
    <TouchableOpacity
      disabled={!onPress || isDisconnected}
      onPress={() => (onPress ? onPress() : {})}
      style={[style]}>
      <View style={styles.container}>
        <DeviceNameWithIcon
          style={{flexShrink: 1}}
          name={name}
          deviceConnectionStatus={deviceConnectionStatus}
          thisDevice={thisDevice}
          deviceType={deviceType}
          deviceId={deviceId}
          iconSize={75}
        />
        <View style={{alignSelf: 'flex-start'}}>
          {dateAdded && (
            <Text style={{fontSize: 12, marginBottom: 10}}>
              <FormattedDate
                value={new Date(dateAdded)}
                year="numeric"
                month="short"
                day="2-digit"
              />
            </Text>
          )}
          {thisDevice && (
            <TouchableOpacity
              onPress={() => {
                navigate('HowToLeaveProject');
              }}>
              <Text style={{fontSize: 12, color: RED}}>
                {formatMessage(m.leaveProject)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
    justifyContent: 'space-between',
  },
});
