import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../../../../images/GreenCheck.svg';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../sharedComponents/Buttons';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  projectCreated: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.projectCreated',
    defaultMessage: '{projectName} Created!',
  },
  inviteDevice: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.invitedDevice',
    defaultMessage: 'Invite Device',
  },
  goToMap: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.goToMap',
    defaultMessage: 'Go to Map',
  },
});

export const ProjectCreated = ({
  route,
  navigation,
}: NativeRootNavigationProps<'ProjectCreated'>) => {
  const {formatMessage: t} = useIntl();

  // disables back button
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );

  function handleGoToMap() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  }

  //This resets the navigation so the user cannot press back and return to this screen
  function handleGoToInviteScreen() {
    navigation.dispatch(() => {
      const routes = [
        {name: 'Home'},
        {name: 'ProjectSettings'},
        {name: 'YourTeam'},
        {name: 'SelectDevice'},
      ];

      return CommonActions.reset({
        routes,
        index: routes.length - 1,
      });
    });
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <GreenCheck />
        <HeaderText
          variant="header2"
          style={{
            textAlign: 'center',
            marginTop: 10,
          }}>
          {t(m.projectCreated, {projectName: route.params.name})}
        </HeaderText>
      </View>
      <View style={{width: '100%', alignItems: 'center'}}>
        <SecondaryButton
          fullSize
          text={t(m.inviteDevice)}
          onPress={handleGoToInviteScreen}
        />

        <PrimaryButton
          style={{marginTop: 20}}
          fullSize
          onPress={handleGoToMap}
          text={t(m.goToMap)}
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
    height: '100%',
    justifyContent: 'space-between',
  },
});
