import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../../../../images/GreenCheck.svg';
import {defineMessages, useIntl} from 'react-intl';
import React from 'react';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {DeviceNameWithIcon} from '../../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../../sharedComponents/RoleWithIcon';
import {Button} from '../../../../sharedComponents/Button';
import {useFocusEffect} from '@react-navigation/native';
import {COORDINATOR_ROLE_ID} from '../../../../sharedTypes';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  inviteAccepted: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.inviteAccepted',
    defaultMessage: 'Invite Accepted',
  },
  addAnotherDevice: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.addAnotherDevice',
    defaultMessage: 'Add Another Device',
  },
  close: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.close',
    defaultMessage: 'Close',
  },
});

export const InviteAccepted = ({
  navigation,
  route,
}: NativeRootNavigationProps<'InviteAccepted'>) => {
  const {formatMessage: t} = useIntl();
  const {role, ...deviceInfo} = route.params;

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <GreenCheck />
        <HeaderText variant="header3" style={{marginTop: 10}}>
          {t(m.inviteAccepted)}
        </HeaderText>
        <DeviceNameWithIcon {...deviceInfo} style={{marginTop: 10}} />
        <RoleWithIcon
          style={{marginTop: 20}}
          role={role === COORDINATOR_ROLE_ID ? 'coordinator' : 'participant'}
        />
      </View>
      <View style={{width: '100%'}}>
        <Button
          fullWidth
          variant="outlined"
          onPress={() => {
            navigation.navigate('SelectDevice');
          }}>
          {t(m.addAnotherDevice)}
        </Button>
        <Button
          style={{marginTop: 10}}
          fullWidth
          onPress={() => {
            navigation.navigate('YourTeam');
          }}>
          {t(m.close)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
});
