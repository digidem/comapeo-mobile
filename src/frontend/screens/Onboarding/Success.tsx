import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SuccessIcon from '../../images/Success.svg';
import NewDeviceLogo from '../../images/NewDeviceLogo.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {useSetOwnDeviceInfo} from '@comapeo/core-react';
import {Loading} from '../../sharedComponents/Loading';
import {WHITE} from '../../lib/styles';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {deviceType} from 'expo-device';
import {expoToCoreDeviceType} from '../../lib/deviceTypeMap';

const m = defineMessages({
  success: {
    id: 'screens.DeviceNaming.Success.success',
    defaultMessage: 'Success!',
  },
  description: {
    id: 'screens.DeviceNaming.Success.description',
    defaultMessage: 'You named your device',
  },
  startUsing: {
    id: 'screens.DeviceNaming.Success.startUsihng',
    defaultMessage: 'Start Using CoMapeo',
  },
  startMappingInstructions: {
    id: 'screens.DeviceNaming.Success.startMappingInstructions',
    defaultMessage:
      'On the next screen, tap the orange button to record your first observation.',
  },
  findSettings: {
    id: 'screens.DeviceNaming.Success.findSettings',
    defaultMessage:
      'To find your project settings go to the main menu found on the map screen.',
  },
});

export const Success = ({
  route,
}: NativeStackScreenProps<OnboardingParamsList, 'Success'>) => {
  const {mutate, status} = useSetOwnDeviceInfo();
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
        <View>
          <Text style={{marginTop: 20}}>{t(m.startMappingInstructions)}</Text>
          <Text></Text>
          <Text>{t(m.findSettings)}</Text>
        </View>
      </View>
      <Button
        testID="ONBOARDING.go-to-map-btn"
        fullWidth
        onPress={() => {
          mutate({
            name: deviceName,
            deviceType: expoToCoreDeviceType(deviceType),
          });
        }}>
        {status === 'pending' ? (
          <Loading style={{padding: 15}} size={15} color={WHITE} />
        ) : status === 'success' ? (
          <MaterialIcons name="check" size={30} color={WHITE} />
        ) : (
          t(m.startUsing)
        )}
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
