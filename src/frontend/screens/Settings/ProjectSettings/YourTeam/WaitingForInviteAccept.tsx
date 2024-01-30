import {BackHandler, StyleSheet, View} from 'react-native';
import InviteSent from '../../../../images/InviteSent.svg';
import {Text} from '../../../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import React from 'react';
import {TextButton} from '../../../../sharedComponents/TextButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeRootNavigationProps} from '../../../../sharedTypes';
import {useProject} from '../../../../hooks/server/projects';
import {useQueryClient} from '@tanstack/react-query';
import {ErrorModal} from '../../../../sharedComponents/ErrorModal';
import {useBottomSheetModal} from '../../../../sharedComponents/BottomSheetModal';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';

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
  closeSheet,
  isOpen,
  sheetRef,
}: Omit<ReturnType<typeof useBottomSheetModal>, 'openSheet'>) => {
  const {formatMessage: t} = useIntl();
  const [time, setTime] = React.useState(0);
  const navigation = useNavigationFromRoot();

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );

  React.useEffect(() => {
    const interval = setInterval(() => setTime(prev => prev + 1), 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <React.Fragment>
      <View style={styles.container}>
        <InviteSent />
        <Text style={{marginTop: 10}}>{t(m.waitingMessage)}</Text>
        <Text style={{marginTop: 20}}>
          {t(m.timerMessage, {seconds: time})}
        </Text>
        <TextButton
          title={t(m.cancelInvite)}
          onPress={() => {
            navigation.navigate('YourTeam');
          }}
        />
      </View>
      <ErrorModal
        sheetRef={sheetRef}
        closeSheet={closeSheet}
        isOpen={isOpen}
        clearError={() => navigation.navigate('YourTeam')}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
});
