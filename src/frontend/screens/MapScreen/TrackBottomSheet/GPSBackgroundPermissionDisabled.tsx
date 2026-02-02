import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {PrimaryButton} from '../../../sharedComponents/Buttons';
import LocationNoFollowAlert from '../../../images/LocationNoFollow.svg';
import {Circle} from '../../../sharedComponents/icons/Circle';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';

const m = defineMessages({
  useLocation: {
    id: 'screens.MapScreen.GPSBackgroundPermissionDisabled.useLocation',
    defaultMessage: 'Use Location?',
  },
  collectsLocation: {
    id: 'screens.MapScreen.GPSBackgroundPermissionDisabled.collectsLocation',
    defaultMessage:
      'Use Location? Tracks location even when closed. Data remains on device only.',
  },
  turnOn: {
    id: 'screens.MapScreen.GPSBackgroundPermissionDisabled.turnOn',
    defaultMessage: 'Turn On Location',
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
      <IconTitleDescription
        icon={
          <Circle radius={30} style={{marginBottom: 20, overflow: 'visible'}}>
            <LocationNoFollowAlert width={70} height={70} />
          </Circle>
        }
        title={formatMessage(m.useLocation)}
        description={formatMessage(m.collectsLocation)}
        style={styles.messageStack}
      />
      <PrimaryButton
        fullSize
        onPress={askBackgroundLocationPermission}
        text={formatMessage(m.turnOn)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  messageStack: {
    marginBottom: 30,
  },
});
