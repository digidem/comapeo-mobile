import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button} from '../../../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

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

type GPSForegroundPermissionDisabledProps = {
  askForegroundLocationPermission: () => void;
};
export const GPSForegroundPermissionDisabled = ({
  askForegroundLocationPermission,
}: GPSForegroundPermissionDisabledProps) => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../../../images/alert-icon.png')}
        width={60}
        height={60}
        style={styles.image}
      />

      <HeaderText variant="header2" style={{marginBottom: 10}}>
        {formatMessage(m.gpsDisabledTitle)}
      </HeaderText>
      <BodyText style={styles.description}>
        {formatMessage(m.gpsDisabledDescription)}
      </BodyText>
      <Button
        fullWidth
        onPress={askForegroundLocationPermission}
        variant="contained"
        color="ComapeoBlue">
        {formatMessage(m.gpsDisabledButtonText)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {marginBottom: 20},
  description: {marginBottom: 30},
});
