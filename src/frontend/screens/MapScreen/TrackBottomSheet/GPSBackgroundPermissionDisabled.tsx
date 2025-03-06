import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {MapPinErrorIconSmall} from '../../../sharedComponents/MapPinErrorIcon/MapPinErrorIconSmall';
import {Button} from '../../../sharedComponents/Button';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

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
      <HeaderText variant="header2" style={styles.title}>
        {formatMessage(m.useLocation)}
      </HeaderText>
      <BodyText style={styles.description}>
        {formatMessage(m.collectsLocation)}
      </BodyText>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
  },
});
