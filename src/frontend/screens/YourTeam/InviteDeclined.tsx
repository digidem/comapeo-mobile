import * as React from 'react';
import {StyleSheet} from 'react-native';
import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {BLACK} from '../../lib/styles';
import {DeviceNameWithIcon} from '../../sharedComponents/DeviceNameWithIcon';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {resetToYourTeam} from '../../lib/resetToYourTeam';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {usePreventBackNavigation} from '../../hooks/usePreventBackNavigation';
import {ScreenContentWithButtonDockNoHeader} from '../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDockNoHeader.tsx';

const m = defineMessages({
  inviteDeclined: {
    id: '$1screens.Settings.YourTeam.InviteDeclined',
    defaultMessage: 'Invitation Declined',
  },
  inviteDeclinedDes: {
    id: 'screens.Settings.YourTeam.inviteDeclinedDes',
    defaultMessage:
      'This device has declined your invitation. They have not joined the project.',
  },
  close: {
    id: '$1screens.Settings.YourTeam.close',
    defaultMessage: 'Close',
  },
});

export const InviteDeclined = ({
  navigation,
  route,
}: NativeRootNavigationProps<'InviteDeclined'>) => {
  const {formatMessage} = useIntl();
  const {name, deviceType, deviceId} = route.params;

  usePreventBackNavigation();

  return (
    <ScreenContentWithButtonDockNoHeader
      contentContainerStyle={styles.content}
      bottomButton={
        <PrimaryButton
          fullSize
          text={formatMessage(m.close)}
          onPress={() => resetToYourTeam(navigation.dispatch)}
        />
      }>
      <ErrorIcon />
      <BodyText variant="large" weight={700} style={styles.title}>
        {formatMessage(m.inviteDeclined)}
      </BodyText>
      <BodyText style={styles.description}>
        {formatMessage(m.inviteDeclinedDes)}
      </BodyText>
      <DeviceNameWithIcon
        name={name}
        deviceType={deviceType}
        deviceId={deviceId}
        style={styles.deviceName}
      />
    </ScreenContentWithButtonDockNoHeader>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    color: BLACK,
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    color: BLACK,
  },
  deviceName: {
    marginTop: 20,
  },
});
