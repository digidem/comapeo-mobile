import * as React from 'react';
import {StyleSheet, View, AppState} from 'react-native';
import SuccessIcon from '../../images/Success.svg';
import NewDeviceLogo from '../../images/NewDeviceLogo.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingList} from '../../Navigation/ScreenGroups/DeviceNamingScreens';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {usePersistedDeviceName} from '../../hooks/persistedState/usePersistedDeviceName';
import {defineMessages, useIntl} from 'react-intl';

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

// these routes are conditionally rendered by react navigation. If the user does not have a deviceName(which is stored in persisted state), they can only see the device naming screens
// According to React Navigation, we are not suppose manually navigate to the map screen(https://reactnavigation.org/docs/auth-flow#dont-manually-navigate-when-conditionally-rendering-screens), the change of deviceName state will handle that
// Therefore this screen only sets the device name in state when the `Go to Map` Button is clicked, therefore changing the state and automatically navigating user to the map screen
// If the user was to close the app before pressing the `Go to Map` button, the device name would not be set, and they would have to do this flow again. The useEeffect function should catch that use case and will set the name in state before closing. When the user opens the app again, the name will be saved, and the user will be navigated to the map screen
export const Success = ({
  route,
}: NativeStackScreenProps<DeviceNamingList, 'Success'>) => {
  const setDeviceName = usePersistedDeviceName(store => store.setDeviceName);
  const deviceName = route.params.deviceName;
  const {formatMessage: t} = useIntl();

  React.useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        setDeviceName(deviceName);
      }
    });
    return () => unsubscribe.remove();
  }, [setDeviceName]);

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
        onPress={() => {
          setDeviceName(deviceName);
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
