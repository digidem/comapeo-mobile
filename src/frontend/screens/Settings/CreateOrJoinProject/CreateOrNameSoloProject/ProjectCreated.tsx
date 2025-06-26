import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../../../../images/Success.svg';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {useFocusEffect} from '@react-navigation/native';
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
}: NativeRootNavigationProps<
  'ProjectCreatedNewProject' | 'ProjectCreatedNewSolo'
>) => {
  const isSolo = route.name === 'ProjectCreatedNewSolo';
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

  function handleGoToConfig() {
    navigation.replace('Config');
  }

  function handleGoToMap() {
    navigation.popToTop();
  }

  function handleGoToInviteScreen() {
    navigation.replace('SelectDevice');
  }

  function handleViewProject() {
    navigation.replace('ProjectSettings');
  }
  const screenActionsAndLabels = isSolo
    ? {
        message: m.projectReady,
        secondaryLabel: m.updateCategories,
        secondaryAction: () => handleGoToConfig(),
        primaryLabel: m.inviteDevice,
        primaryAction: () => handleGoToInviteScreen(),
      }
    : {
        message: m.nowAdded,
        secondaryLabel: m.goToMap,
        secondaryAction: () => handleGoToMap(),
        primaryLabel: m.viewProject,
        primaryAction: () => handleViewProject(),
      };

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
            {t(screenActionsAndLabels.message)}
          </BodyText>
        </View>
      </View>
      <View style={{width: '100%', alignItems: 'center'}}>
        <SecondaryButton
          fullSize
          text={t(screenActionsAndLabels.secondaryLabel)}
          onPress={screenActionsAndLabels.secondaryAction}
        />
        <PrimaryButton
          style={{marginTop: 20}}
          fullSize
          onPress={screenActionsAndLabels.primaryAction}
          text={t(screenActionsAndLabels.primaryLabel)}
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
