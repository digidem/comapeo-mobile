import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {LinkIcon} from '../../sharedComponents/LinkIcon';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {DARK_GREY, DARK_ORANGE, NEW_DARK_GREY} from '../../lib/styles';
import SafetyIcon from '../../images/Safety.svg';
import StopwatchIcon from '../../images/Stopwatch.svg';
import GreenSquareCheckmark from '../../images/GreenSquareCheckmark.svg';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const POINT_ICON_SIZE = 26;

const m = defineMessages({
  title: {
    id: 'screens.YourTeam.InviteLinkIntro.title',
    defaultMessage: 'Introducing Invite Links',
  },
  description: {
    id: 'screens.YourTeam.InviteLinkIntro.description',
    defaultMessage: 'Easily invite remote devices using an internet connection',
  },
  secure: {
    id: 'screens.YourTeam.InviteLinkIntro.secure',
    defaultMessage: 'Private, secure, shareable links',
  },
  validFor: {
    id: 'screens.YourTeam.InviteLinkIntro.validFor',
    defaultMessage: 'Valid for 24 hours',
  },
  multipleUses: {
    id: 'screens.YourTeam.InviteLinkIntro.multipleUses',
    defaultMessage: 'Can be used multiple times',
  },
  continue: {
    id: 'screens.YourTeam.InviteLinkIntro.continue',
    defaultMessage: 'Continue',
  },
  close: {
    id: 'screens.YourTeam.InviteLinkIntro.close',
    defaultMessage: 'Close',
  },
});

export function InviteLinkIntro({
  navigation,
}: NativeRootNavigationProps<'InviteLinkIntro'>) {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.content}
      dockContent={
        <View style={styles.dock}>
          <PrimaryButton
            fullSize
            text={t(m.continue)}
            onPress={() =>
              navigation.navigate('SelectInviteeRole', {invitee: 'link'})
            }
          />
          <SecondaryButton
            fullSize
            text={t(m.close)}
            onPress={() => navigation.goBack()}
          />
        </View>
      }>
      <View style={styles.header}>
        <LinkIcon size={90} color={DARK_ORANGE} />
        <HeaderText variant="header1" style={styles.title}>
          {t(m.title)}
        </HeaderText>
      </View>

      <View style={styles.body}>
        <BodyText style={styles.description}>{t(m.description)}</BodyText>

        <View style={styles.points}>
          <Point
            icon={
              <SafetyIcon width={POINT_ICON_SIZE} height={POINT_ICON_SIZE} />
            }
            text={t(m.secure)}
          />
          <Point
            icon={
              <StopwatchIcon width={POINT_ICON_SIZE} height={POINT_ICON_SIZE} />
            }
            text={t(m.validFor)}
          />
          <Point
            icon={
              <GreenSquareCheckmark
                width={POINT_ICON_SIZE}
                height={POINT_ICON_SIZE}
              />
            }
            text={t(m.multipleUses)}
          />
        </View>
      </View>
    </ScreenContentWithDock>
  );
}

function Point({icon, text}: {icon: React.ReactNode; text: string}) {
  return (
    <View style={styles.point}>
      {icon}
      <BodyText variant="smallMeta" style={styles.pointText}>
        {text}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 20,
    gap: 15,
  },
  header: {
    alignItems: 'center',
    gap: 20,
    paddingTop: 120,
  },
  title: {
    textAlign: 'center',
    color: DARK_GREY,
  },
  body: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  description: {
    textAlign: 'center',
    color: DARK_GREY,
  },
  points: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    gap: 12,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointText: {
    flex: 1,
    color: NEW_DARK_GREY,
  },
  dock: {
    gap: 15,
  },
});
