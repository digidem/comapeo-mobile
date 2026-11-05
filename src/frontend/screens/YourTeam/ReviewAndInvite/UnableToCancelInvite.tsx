import * as React from 'react';
import {StyleSheet} from 'react-native';
import ErrorIcon from '../../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {BLACK} from '../../../lib/styles';
import {DeviceNameWithIcon} from '../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../sharedComponents/RoleWithIcon';
import {COORDINATOR_ROLE_ID} from '../../../sharedTypes';
import {useProjectSettings} from '../../../hooks/server/projects';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {resetToYourTeam} from '../../../lib/resetToYourTeam';
import {PrimaryButton} from '../../../sharedComponents/Buttons';
import {ScreenContentWithButtonDockNoHeader} from '../../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDockNoHeader.tsx.tsx';

const m = defineMessages({
  unableToCancel: {
    id: 'screens.Settings.YourTeam.unableToCancel',
    defaultMessage: 'Unable to Cancel Invitation',
  },
  deviceHasJoined: {
    id: 'screens.Settings.YourTeam.deviceHasJoined',
    defaultMessage: 'Device Has Joined {projectName}',
  },
  close: {
    id: 'screens.Settings.YourTeam.close',
    defaultMessage: 'Close',
  },
});

export const UnableToCancelInvite = ({
  navigation,
  route,
}: NativeRootNavigationProps<'UnableToCancelInvite'>) => {
  const {formatMessage} = useIntl();
  const {role, ...deviceInfo} = route.params;
  const {data} = useProjectSettings();

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
        {formatMessage(m.unableToCancel)}
      </BodyText>
      {data?.name && (
        <BodyText style={styles.subtitle}>
          {formatMessage(m.deviceHasJoined, {projectName: data.name})}
        </BodyText>
      )}
      <DeviceNameWithIcon {...deviceInfo} style={styles.deviceName} />
      <RoleWithIcon
        style={styles.role}
        role={role === COORDINATOR_ROLE_ID ? 'coordinator' : 'participant'}
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
  subtitle: {
    marginTop: 10,
    color: BLACK,
  },
  deviceName: {
    marginTop: 10,
  },
  role: {
    marginTop: 20,
  },
});
