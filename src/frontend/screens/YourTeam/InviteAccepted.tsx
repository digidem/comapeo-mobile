import {StyleSheet} from 'react-native';
import GreenCheck from '../../images/Success.svg';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import React from 'react';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {SecondaryButton, PrimaryButton} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {BLACK} from '../../lib/styles';
import {usePreventBackNavigation} from '../../hooks/usePreventBackNavigation';
import {ScreenContentWithButtonDockNoHeader} from '../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDockNoHeader.tsx.tsx';

const m = defineMessages({
  inviteAccepted: {
    id: 'screens.Setting.ProjectSettings.YourTeam.InviteAccepted.inviteAccepted',
    defaultMessage: 'Accepted!',
  },
  addAnotherDevice: {
    id: '$1screens.Setting.ProjectSettings.YourTeam.InviteAccepted.addAnotherDevice',
    defaultMessage: 'Invite Another Device',
  },
  done: {
    id: '$1screens.Setting.ProjectSettings.YourTeam.InviteAccepted.done',
    defaultMessage: 'Done',
  },
  partOfProject: {
    id: '$1screens.Setting.ProjectSettings.YourTeam.InviteAccepted.partOfProject',
    defaultMessage: '<bold>{deviceName}</bold> is now part of your project.',
  },
});

export const InviteAccepted = ({
  navigation,
  route,
}: NativeRootNavigationProps<'InviteAccepted'>) => {
  const {formatMessage: t} = useIntl();
  const {name} = route.params;

  usePreventBackNavigation();

  return (
    <ScreenContentWithButtonDockNoHeader
      contentContainerStyle={styles.content}
      topButton={
        <PrimaryButton
          fullSize
          text={t(m.addAnotherDevice)}
          onPress={() => {
            navigation.popTo('SelectDevice');
          }}
        />
      }
      bottomButton={
        <SecondaryButton
          fullSize
          text={t(m.done)}
          onPress={() => navigation.popToTop()}
        />
      }>
      <GreenCheck style={{alignSelf: 'center'}} width="80" height="80" />
      <HeaderText variant="header1" style={{color: BLACK}}>
        {t(m.inviteAccepted)}
      </HeaderText>
      <BodyText style={styles.description}>
        <FormattedMessage
          {...m.partOfProject}
          values={{
            deviceName: name,
            bold: (chunks: React.ReactNode) => (
              <BodyText key="bold" weight={700}>
                {chunks}
              </BodyText>
            ),
          }}
        />
      </BodyText>
    </ScreenContentWithButtonDockNoHeader>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 30,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
