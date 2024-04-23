import * as React from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';
import * as Location from 'expo-location';
import {defineMessages, useIntl} from 'react-intl';

const handleOpenSettings = () => {
  Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
};

const m = defineMessages({
  gpsDisabledTitle: {
    id: 'Modal.GPSDisable.title',
    defaultMessage: 'GPS Disabled',
  },
  gpsDisabledDescription: {
    id: 'Modal.GPSDisable.description',
    defaultMessage:
      'To create a Track CoMapeo needs access to your location and GPS.',
  },
  gpsDisabledButtonText: {
    id: 'Modal.GPSDisable.button',
    defaultMessage: 'Enable',
  },
});

interface GPSPermissionsDisabled {
  setIsGranted: React.Dispatch<React.SetStateAction<boolean | null>>;
}
export const GPSPermissionsDisabled: React.FC<GPSPermissionsDisabled> = ({
  setIsGranted,
}) => {
  const {formatMessage} = useIntl();
  const requestForLocationPermissions = async () => {
    const [foregroundPermission, backgroundPermission] = await Promise.all([
      Location.requestForegroundPermissionsAsync(),
      Location.requestBackgroundPermissionsAsync(),
    ]);
    if (foregroundPermission.granted && backgroundPermission.granted) {
      setIsGranted(true);
    } else if (
      !foregroundPermission.canAskAgain ||
      !backgroundPermission.canAskAgain
    ) {
      handleOpenSettings();
    }
  };

  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../../../images/alert-icon.png')}
        width={60}
        height={60}
        style={styles.image}
      />

      <Text style={styles.title}>{formatMessage(m.gpsDisabledTitle)}</Text>
      <Text style={styles.description}>
        {formatMessage(m.gpsDisabledDescription)}
      </Text>
      <Button
        fullWidth
        onPress={requestForLocationPermissions}
        style={styles.button}>
        <Text style={styles.buttonText}>
          {formatMessage(m.gpsDisabledButtonText)}
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 30,
    zIndex: 11,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {marginBottom: 30},
  title: {fontSize: 24, fontWeight: 'bold', textAlign: 'center'},
  description: {fontSize: 20, textAlign: 'center', marginBottom: 30},
  button: {marginBottom: 20, marginVertical: 8.5},
  buttonText: {fontWeight: '500', color: '#fff'},
});
