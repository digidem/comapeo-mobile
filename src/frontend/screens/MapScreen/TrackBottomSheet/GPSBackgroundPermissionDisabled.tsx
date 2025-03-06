import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../sharedComponents/Text';
import {MapPinErrorIconSmall} from '../../../sharedComponents/MapPinErrorIcon/MapPinErrorIconSmall';
import {Button} from '../../../sharedComponents/Button';

const m = defineMessages({
  useLocation: {
    id: 'screens.MapScreen.GPSBackgroundPermissionDisabled.useLocation',
    defaultMessage: 'Use Your Location',
  },
  collectsLocation: {
    id: 'screens.MapScreen.GPSBackgroundPermissionDisabled.collectsLocation',
    defaultMessage:
      'CoMapeo collects location data to track your route on the map, even when the app is closed. Your location data is only stored on your device by default, and is not stored or sent anywhere.',
  },
  turnOn: {
    id: 'screens.MapScreen.GPSBackgroundPermissionDisabled.turnOn',
    defaultMessage: 'Turn On',
  },
});

type GPSBackgroundPermissionDisabledProp = {
  askBackgroundLocationPermission: () => void;
};

export const GPSBackgroundPermissionDisabled = ({
  askBackgroundLocationPermission,
}: GPSBackgroundPermissionDisabledProp) => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <MapPinErrorIconSmall style={{marginBottom: 20}} />
      <Text style={styles.title}>{formatMessage(m.useLocation)}</Text>
      <Text style={styles.description}>
        {formatMessage(m.collectsLocation)}
      </Text>
      <Button fullWidth onPress={askBackgroundLocationPermission}>
        {formatMessage(m.turnOn)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
  },
});
