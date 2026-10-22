import * as React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {LinkIcon} from '../../../sharedComponents/LinkIcon';

import {
  PrimaryButton,
  SecondaryButton,
} from '../../../sharedComponents/Buttons';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import WarningYellow from '../../../images/WarningYellow.svg';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {RoleWithIcon} from '../../../sharedComponents/RoleWithIcon';
import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {useOpenShareDialog} from '../../../hooks/share';
import {useTimeRemaining} from '../../../hooks/useTimeRemaining';
import {COORDINATOR_ROLE_ID} from '../../../sharedTypes';
import {BLUE_GREY, COMAPEO_BLUE, LIGHT_ORANGE} from '../../../lib/styles';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

// Enough to tell two links apart in the list without showing the whole hash.
const SHORT_ID_LENGTH = 7;

const m = defineMessages({
  navTitle: {
    id: 'screens.YourTeam.InviteLinkReady.navTitle',
    defaultMessage: 'Invite Link',
  },
  keepOpen: {
    id: 'screens.YourTeam.InviteLinkReady.keepOpen',
    defaultMessage: 'Keep app open to approve requests.',
  },
  readyToShare: {
    id: 'screens.YourTeam.InviteLinkReady.readyToShare',
    defaultMessage: 'Invite {shortId} ready to share!',
  },
  expiresIn: {
    id: 'screens.YourTeam.InviteLinkReady.expiresIn',
    defaultMessage: 'Expires in {timeRemaining}',
  },
  deleteLink: {
    id: 'screens.YourTeam.InviteLinkReady.deleteLink',
    defaultMessage: 'Delete Invite Link',
  },
  share: {
    id: 'screens.YourTeam.InviteLinkReady.share',
    defaultMessage: 'Share',
  },
  returnToTeam: {
    id: 'screens.YourTeam.InviteLinkReady.returnToTeam',
    defaultMessage: 'Return to Team',
  },
});

export function InviteLinkReady({
  route,
  navigation,
}: NativeRootNavigationProps<'InviteLinkReady'>) {
  const {formatMessage: t} = useIntl();
  const {url, inviteId, roleId, expiresAt, openedFrom} = route.params;
  const openShare = useOpenShareDialog();
  const timeRemaining = useTimeRemaining(expiresAt);

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.content}
      dockContent={
        <View style={styles.dock}>
          <PrimaryButton
            fullSize
            text={t(m.share)}
            onPress={() => openShare.mutate({message: url})}
            renderIcon={({color, size}) => (
              <MaterialIcon name="share" size={size} color={color} />
            )}
          />
          {openedFrom === 'create' ? (
            <SecondaryButton
              fullSize
              text={t(m.returnToTeam)}
              onPress={() => navigation.navigate('YourTeam')}
              renderIcon={({color, size}) => (
                <MaterialIcon name="people" size={size} color={color} />
              )}
            />
          ) : null}
        </View>
      }>
      <View style={styles.warningBanner}>
        <WarningYellow width={26} height={26} />
        <HeaderText variant="header6" style={styles.warningText}>
          {t(m.keepOpen)}
        </HeaderText>
      </View>

      <LinkIcon size={80} color={COMAPEO_BLUE} />

      <HeaderText variant="header2" style={styles.title}>
        {t(m.readyToShare, {shortId: inviteId.slice(0, SHORT_ID_LENGTH)})}
      </HeaderText>

      <RoleWithIcon
        role={roleId === COORDINATOR_ROLE_ID ? 'coordinator' : 'participant'}
      />

      <BodyText style={styles.expires}>
        {t(m.expiresIn, {timeRemaining})}
      </BodyText>

      <Pressable
        onPress={() => navigation.navigate('DeleteInviteLink', route.params)}
        hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
        <HeaderText variant="header6" style={styles.deleteLink}>
          {t(m.deleteLink)}
        </HeaderText>
      </Pressable>
    </ScreenContentWithDock>
  );
}

InviteLinkReady.navTitle = m.navTitle;

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    backgroundColor: LIGHT_ORANGE,
  },
  warningText: {
    flexShrink: 1,
  },
  title: {
    textAlign: 'center',
  },
  expires: {
    textAlign: 'center',
  },
  deleteLink: {
    color: COMAPEO_BLUE,
  },
  dock: {
    gap: 12,
  },
});
