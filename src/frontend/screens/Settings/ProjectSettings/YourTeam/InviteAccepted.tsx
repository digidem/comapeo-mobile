import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../../../../images/Success.svg';
import {defineMessages, useIntl} from 'react-intl';
import React from 'react';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {
  SecondaryButton,
  PrimaryButton,
} from '../../../../sharedComponents/Buttons';
import {useFocusEffect} from '@react-navigation/native';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {resetToYourTeam} from '../../../../lib/resetToYourTeam';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {BLACK} from '../../../../lib/styles';

const m = defineMessages({
  inviteAccepted: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.inviteAccepted',
    defaultMessage: 'Accepted!',
  },
  addAnotherDevice: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.addAnotherDevice',
    defaultMessage: 'Invite Another Device',
  },
  viewTeam: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.viewTeam',
    defaultMessage: 'View Team',
  },
  partOfProject: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.partOfProject',
    defaultMessage: '<bold>{deviceName}</bold> is now part of your project.',
  },
});

export const InviteAccepted = ({
  navigation,
  route,
}: NativeRootNavigationProps<'InviteAccepted'>) => {
  const {formatMessage: t} = useIntl();
  const {name} = route.params;

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
      <View style={{alignItems: 'center', gap: 30}}>
        <GreenCheck width="80" height="80" />
        <HeaderText variant="header1" style={{color: BLACK}}>
          {t(m.inviteAccepted)}
        </HeaderText>
        <BodyText style={{textAlign: 'center', paddingHorizontal: 40}}>
          {t(m.partOfProject, {
            deviceName: name,
          })}
        </BodyText>
      </View>
      <View style={{alignItems: 'center', gap: 12}}>
        <SecondaryButton
          fullSize
          text={t(m.viewTeam)}
          onPress={() => resetToYourTeam(navigation.dispatch)}
        />
        <PrimaryButton
          fullSize
          text={t(m.addAnotherDevice)}
          onPress={() => {
            navigation.popTo('SelectDevice');
          }}
        />
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
