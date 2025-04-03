import {AppState, StyleSheet, View} from 'react-native';
import InviteSent from '../../../../../images/InviteSent.svg';
import {defineMessages, useIntl} from 'react-intl';
import React from 'react';
import {TextButton} from '../../../../../sharedComponents/TextButton';
import {useNavigationFromRoot} from '../../../../../hooks/useNavigationWithTypes';
import {HeaderText} from '../../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../../sharedComponents/Text/BodyText';
import {usePreventAndroidBackButton} from '../../../../../hooks/usePreventAndroidBackButton';

const m = defineMessages({
  waitingMessage: {
    id: 'screens.Setting.ProjectSettings.YourTeam.WaitingForInviteAccept.waitingMessage',
    defaultMessage: 'Waiting for Device to Accept Invite',
  },
  timerMessage: {
    id: 'screens.Setting.ProjectSettings.YourTeam.WaitingForInviteAccept.timerMessage',
    defaultMessage: 'Invite sent {seconds}s ago',
  },
  cancelInvite: {
    id: 'screens.Setting.ProjectSettings.YourTeam.WaitingForInviteAccept.cancelInvite',
    defaultMessage: 'Cancel Invite',
  },
});

export const WaitingForInviteAccept = ({
  cancelInvite,
}: {
  cancelInvite: () => void;
}) => {
  const {formatMessage: t} = useIntl();
  const [time, setTime] = React.useState(0);
  const navigation = useNavigationFromRoot();

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  usePreventAndroidBackButton();

  React.useEffect(() => {
    // cancels invite if app is closed or goes into background
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background' || nextState === 'inactive') {
        cancelInvite();
      }
    });

    return () => subscription.remove();
  }, [cancelInvite]);

  React.useEffect(() => {
    const interval = setInterval(() => setTime(prev => prev + 1), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <InviteSent />
      <HeaderText style={{marginTop: 10, textAlign: 'center'}}>
        {t(m.waitingMessage)}
      </HeaderText>
      <BodyText style={{marginTop: 20}}>
        {t(m.timerMessage, {seconds: time})}
      </BodyText>
      <TextButton title={t(m.cancelInvite)} onPress={cancelInvite} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
});
