import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import SuccessIcon from '../../images/Success.svg';
import {NEW_DARK_GREY, DARK_GREY} from '../../lib/styles';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  deviceRemoved: {
    id: 'screens.YourTeam.DeviceRemovedSuccess.deviceRemoved',
    defaultMessage: 'Device removed.',
  },
  notified: {
    id: 'screens.YourTeam.DeviceRemovedSuccess.notified',
    defaultMessage:
      '<boldDevice>{deviceName}</boldDevice> has been notified they can no longer view or contribute to <boldProject>{projectName}</boldProject>.',
  },
  returnToTeam: {
    id: 'screens.YourTeam.DeviceRemovedSuccess.returnToTeam',
    defaultMessage: 'Return to Team',
  },
});

export const DeviceRemovedSuccess = ({
  navigation,
  route,
}: NativeRootNavigationProps<'DeviceRemovedSuccess'>) => {
  const {formatMessage: t} = useIntl();
  const {deviceName, projectName} = route.params;

  const handleReturnToTeam = () => {
    navigation.replace('YourTeam', {projectName});
  };

  return (
    <ScreenContentWithDock
      dockContent={
        <PrimaryButton
          fullSize
          text={t(m.returnToTeam)}
          onPress={handleReturnToTeam}
          renderIcon={({color, size}) => (
            <MaterialIcon color={color} size={size} name="people" />
          )}
        />
      }
      contentContainerStyle={{marginTop: 80}}>
      <View style={{alignItems: 'center'}}>
        <SuccessIcon />
        <HeaderText variant="header2" style={styles.headerText}>
          {t(m.deviceRemoved)}
        </HeaderText>
        <BodyText style={styles.bodyText}>
          <FormattedMessage
            {...m.notified}
            values={{
              deviceName,
              projectName,
              boldDevice: (chunks: React.ReactNode) => (
                <HeaderText variant="header5">{chunks}</HeaderText>
              ),
              boldProject: (chunks: React.ReactNode) => (
                <HeaderText variant="header5">{chunks}</HeaderText>
              ),
            }}
          />
        </BodyText>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    marginTop: 30,
    color: DARK_GREY,
  },
  bodyText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
    paddingHorizontal: 40,
    marginTop: 30,
  },
});
