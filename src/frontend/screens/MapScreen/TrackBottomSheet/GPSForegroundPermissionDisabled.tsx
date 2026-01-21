import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {PrimaryButton} from '../../../sharedComponents/Buttons';
import NoGpsAlert from '../../../images/AlertIcon.svg';
import {Circle} from '../../../sharedComponents/icons/Circle';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';

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
      <IconTitleDescription
        icon={
          <Circle radius={30} style={{marginBottom: 20, overflow: 'visible'}}>
            <NoGpsAlert width={70} height={70} />
          </Circle>
        }
        title={formatMessage(m.gpsDisabledTitle)}
        description={formatMessage(m.gpsDisabledDescription)}
        gap={10}
        style={styles.messageStack}
      />
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
  messageStack: {
    marginBottom: 30,
    paddingHorizontal: 50,
  },
});
