import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../../../../images/Success.svg';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../sharedComponents/Buttons';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BLACK, NEW_DARK_GREY} from '../../../../lib/styles';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';

const m = defineMessages({
  success: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.success',
    defaultMessage: 'Success!',
  },
  projectReady: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.projectReady',
    defaultMessage: 'is now ready for you to invite devices.',
  },
  nowAdded: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.nowAdded',
    defaultMessage: 'now added to All Projects',
  },
  inviteDevice: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.invitedDevice',
    defaultMessage: 'Invite a Device',
  },
  goToMap: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.goToMap',
    defaultMessage: 'Start Mapping',
  },
  viewProject: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.viewProject',
    defaultMessage: 'View Project',
  },
  updateCategories: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.updateCategories',
    defaultMessage: 'Update Categories Set',
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

  function resetTo(routes: {name: string}[]) {
    navigation.dispatch(
      CommonActions.reset({
        routes,
        index: routes.length - 1,
      }),
    );
  }

  function handleGoToConfig() {
    resetTo([
      {name: 'Home'},
      {name: 'Menu'},
      {name: 'ProjectSettings'},
      {name: 'Config'},
    ]);
  }

  function handleGoToMap() {
    resetTo([{name: 'Home'}]);
  }

  function handleGoToInviteScreen() {
    resetTo([
      {name: 'Home'},
      {name: 'Menu'},
      {name: 'ProjectSettings'},
      {name: 'YourTeam'},
      {name: 'SelectDevice'},
    ]);
  }

  function handleViewProject() {
    resetTo([{name: 'Home'}, {name: 'Menu'}, {name: 'ProjectSettings'}]);
  }

  const screenOptionsObject = {
    updatedSolo: {
      message: m.projectReady,
      secondaryLabel: m.updateCategories,
      secondaryAction: () => handleGoToConfig(),
      primaryLabel: m.inviteDevice,
      primaryAction: () => handleGoToInviteScreen(),
    },
    newlyCreated: {
      message: m.nowAdded,
      secondaryLabel: m.goToMap,
      secondaryAction: () => handleGoToMap(),
      primaryLabel: m.viewProject,
      primaryAction: () => handleViewProject(),
    },
  };

  const setup = screenOptionsObject[route.params.type];

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', gap: 30}}>
        <GreenCheck />
        <HeaderText
          variant="header1"
          style={{
            textAlign: 'center',
            color: BLACK,
          }}>
          {t(m.success)}
        </HeaderText>
        <View style={{gap: 10}}>
          <HeaderText
            variant="header5"
            style={{
              textAlign: 'center',
            }}>
            {route.params.name}
          </HeaderText>
          <BodyText
            style={{
              textAlign: 'center',
              color: NEW_DARK_GREY,
            }}>
            {t(setup.message)}
          </BodyText>
        </View>
      </View>
      <View style={{width: '100%', alignItems: 'center'}}>
        <SecondaryButton
          fullSize
          text={t(setup.secondaryLabel)}
          onPress={setup.secondaryAction}
        />
        <PrimaryButton
          style={{marginTop: 20}}
          fullSize
          onPress={setup.primaryAction}
          text={t(setup.primaryLabel)}
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
