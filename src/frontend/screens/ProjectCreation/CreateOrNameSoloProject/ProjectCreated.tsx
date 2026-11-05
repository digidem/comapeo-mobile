import * as React from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {View} from 'react-native';
import GreenCheck from '../../../images/Success.svg';
import GraphIcon from '../../../images/Graph.svg';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../sharedComponents/Buttons';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BLACK, NEW_DARK_GREY} from '../../../lib/styles';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {usePreventBackNavigation} from '../../../hooks/usePreventBackNavigation';
import {ScreenContentWithButtonDockNoHeader} from '../../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDockNoHeader.tsx.tsx';

const m = defineMessages({
  success: {
    id: '$1screens.Settings.CreateOrJoinProject.ProjectCreated.success',
    defaultMessage: 'Success!',
  },
  projectReady: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.projectReady',
    defaultMessage: '{projectName} is now ready for you to invite devices.',
  },
  inviteDevice: {
    id: '$1screens.Settings.CreateOrJoinProject.ProjectCreated.inviteDevice',
    defaultMessage: 'Invite a Device',
  },
  done: {
    id: '$1screens.Settings.CreateOrJoinProject.ProjectCreated.done',
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

  usePreventBackNavigation();

  function handleGoToMap() {
    navigation.popToTop();
  }
  function handleGoToInviteScreen() {
    navigation.navigate('SelectDevice');
  }

  return (
    <ScreenContentWithButtonDockNoHeader
      contentContainerStyle={{gap: 30}}
      topButton={
        <PrimaryButton
          fullSize
          onPress={handleGoToInviteScreen}
          text={t(m.inviteDevice)}
        />
      }
      bottomButton={
        <SecondaryButton fullSize text={t(m.done)} onPress={handleGoToMap} />
      }>
      <GreenCheck style={{alignSelf: 'center'}} />
      <HeaderText variant="header1" style={{textAlign: 'center', color: BLACK}}>
        {t(m.success)}
      </HeaderText>
      <View style={{gap: 30}}>
        <BodyText
          style={{
            textAlign: 'center',
            color: NEW_DARK_GREY,
            paddingHorizontal: 20,
          }}>
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
    </ScreenContentWithButtonDockNoHeader>
  );
};
