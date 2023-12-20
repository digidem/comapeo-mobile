import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import SuccessIcon from '../images/Success.svg';
import NewDeviceLogo from '../images/NewDeviceLogo.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from '../sharedComponents/Text';
import {Button} from '../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {DeviceNamingSceens} from '../Navigation/ScreenGroups/DeviceNamingScreens';
import {useEditDeviceInfo} from '../hooks/server/deviceInfo';

const m = defineMessages({
  success: {
    id: 'screens.DeviceNaming.Success.success',
    defaultMessage: 'Success!',
  },
  description: {
    id: 'screens.DeviceNaming.Success.description',
    defaultMessage: 'You named your device',
  },
  goToMap: {
    id: 'screens.DeviceNaming.Success.goToMap',
    defaultMessage: 'Go to Map',
  },
});

export const Success = ({
  route,
  navigation,
}: NativeStackScreenProps<DeviceNamingSceens, 'Success'>) => {
  const setDeviceName = useEditDeviceInfo();
  const deviceName = route.params.deviceName;
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <SuccessIcon />
        <Text style={styles.text}>{t(m.success)}</Text>
        <Text style={{marginTop: 20}}>{t(m.description)} </Text>
        <View style={styles.deviceText}>
          <NewDeviceLogo />
          <Text style={{marginLeft: 10}}>{deviceName}</Text>
        </View>
      </View>
      <Button
        fullWidth
        // due to conditional rendering, there is a brief second, where the state is no longer pending, but the user has not been navigated. So if we don't do catch all these state, the button flickers briefly before navigating
        isLoading={
          setDeviceName.isPending ||
          setDeviceName.isSuccess ||
          setDeviceName.isError
        }
        onPress={() => {
          // This route is conditionally rendered. Once a device name is set, the user will be autmatically navigated to the map
          setDeviceName.mutate(deviceName);
        }}>
        {t(m.goToMap)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 32,
    marginTop: 20,
  },
  deviceText: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
