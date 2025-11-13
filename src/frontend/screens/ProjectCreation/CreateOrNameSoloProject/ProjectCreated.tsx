import * as React from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../../../images/Success.svg';
import GraphIcon from '../../../images/Graph.svg';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../sharedComponents/Buttons';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BLACK, NEW_DARK_GREY} from '../../../lib/styles';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

const m = defineMessages({
  success: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.success',
    defaultMessage: 'Success!',
  },
  projectReady: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.projectReady',
    defaultMessage: '{projectName} is now ready for you to invite devices.',
  },
  inviteDevice: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.inviteDevice',
    defaultMessage: 'Invite a Device',
  },
  done: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.done',
    defaultMessage: 'Done',
  },
  sharedLine: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.sharedLine',
    defaultMessage: 'Project statistics are being shared with Awana Digital',
  },
});

export const ProjectCreated = ({
  route,
  navigation,
}: NativeRootNavigationProps<'ProjectCreated'>) => {
  const {formatMessage: t} = useIntl();
  const {name, statsShared} = route.params;

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
    navigation.popToTop();
  }
  function handleGoToInviteScreen() {
    navigation.navigate('SelectDevice');
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', gap: 30}}>
        <GreenCheck />
        <HeaderText
          variant="header1"
          style={{textAlign: 'center', color: BLACK}}>
          {t(m.success)}
        </HeaderText>
        <View style={{gap: 30}}>
          <BodyText style={{color: NEW_DARK_GREY, paddingHorizontal: 20}}>
            <FormattedMessage
              {...m.projectReady}
              values={{
                projectName: <HeaderText variant="header5">{name}</HeaderText>,
              }}
            />
          </BodyText>

          {statsShared ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 30,
              }}>
              <GraphIcon width={20} height={20} color={NEW_DARK_GREY} />
              <BodyText>{t(m.sharedLine)}</BodyText>
            </View>
          ) : null}
        </View>
      </View>

      <View style={{gap: 12}}>
        <SecondaryButton fullSize text={t(m.done)} onPress={handleGoToMap} />
        <PrimaryButton
          fullSize
          onPress={handleGoToInviteScreen}
          text={t(m.inviteDevice)}
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
