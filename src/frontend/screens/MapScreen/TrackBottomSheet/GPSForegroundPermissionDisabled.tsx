import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../../sharedComponents/Buttons';
import NoGpsAlert from '../../../images/AlertIcon.svg';
import {Circle} from '../../../sharedComponents/icons/Circle';

const m = defineMessages({
  gpsDisabledTitle: {
    id: 'Modal.GPSDisable.title',
    defaultMessage: 'GPS Disabled',
  },
  gpsDisabledDescription: {
    id: 'Modal.GPSDisable.description',
    defaultMessage: 'GPS and location needed to record tracks.',
  },
  gpsDisabledButtonText: {
    id: 'Modal.GPSDisable.button',
    defaultMessage: 'Enable GPS',
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
      <Circle radius={30} style={{marginBottom: 20, overflow: 'visible'}}>
        <NoGpsAlert width={70} height={70} />
      </Circle>
      <HeaderText variant="header2" style={{marginBottom: 10}}>
        {formatMessage(m.gpsDisabledTitle)}
      </HeaderText>
      <BodyText style={styles.description}>
        {formatMessage(m.gpsDisabledDescription)}
      </BodyText>
      <PrimaryButton
        fullSize
        onPress={askForegroundLocationPermission}
        text={formatMessage(m.gpsDisabledButtonText)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  description: {marginBottom: 30, paddingHorizontal: 50, textAlign: 'center'},
});
