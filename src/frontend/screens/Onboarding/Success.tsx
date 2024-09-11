import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SuccessIcon from '../../images/Success.svg';
import NewDeviceLogo from '../../images/NewDeviceLogo.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {useEditDeviceInfo} from '../../hooks/server/deviceInfo';
import {Loading} from '../../sharedComponents/Loading';
import {WHITE} from '../../lib/styles';
import {OnboardingParamsList} from '../../sharedTypes/navigation';

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
  startMappingInstructions: {
    id: 'screens.DeviceNaming.Success.startMappingInstructions',
    defaultMessage:
      'You can start mapping alone or start mapping with a team. Create or join a project in order to share data with other devices that are part of the same project.',
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
        <Text style={{marginTop: 20}}>{t(m.startMappingInstructions)}</Text>
        <Text>{t(m.findSettings)}</Text>
      </View>
      <Button
        testID="ONBOARDING.go-to-map-btn"
        fullWidth
        onPress={() => {
          setDeviceName.mutate(deviceName);
        }}>
        {setDeviceName.isPending ? (
          <Loading style={{padding: 15}} size={15} color={WHITE} />
        ) : setDeviceName.isSuccess ? (
          <MaterialIcons name="check" size={30} color={WHITE} />
        ) : (
          t(m.goToMap)
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
