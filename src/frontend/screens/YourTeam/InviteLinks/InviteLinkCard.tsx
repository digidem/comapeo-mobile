import {Pressable, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {useTimeRemaining} from '../../../hooks/useTimeRemaining';
import {COORDINATOR_ROLE_ID} from '../../../sharedTypes';
import {BLACK, BLUE_GREY, NEW_DARK_GREY} from '../../../lib/styles';
import type {MemberApi} from '@comapeo/core';

// Enough to tell two links apart without showing the whole hash.
const SHORT_ID_LENGTH = 7;

const m = defineMessages({
  name: {
    id: 'screens.YourTeam.InviteLinkCard.name',
    defaultMessage: 'Invite {shortId}',
  },
  meta: {
    id: 'screens.YourTeam.InviteLinkCard.meta',
    defaultMessage: '{role} - {timeRemaining} left',
  },
  coordinator: {
    id: 'screens.YourTeam.InviteLinkCard.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: 'screens.YourTeam.InviteLinkCard.participant',
    defaultMessage: 'Participant',
  },
});

export function InviteLinkCard({
  inviteLink,
  onPress,
}: {
  inviteLink: MemberApi.InviteLink;
  onPress: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const timeRemaining = useTimeRemaining(inviteLink.expiresAt);
  const isCoordinator = inviteLink.roleId === COORDINATOR_ROLE_ID;

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.text}>
        <HeaderText variant="header5">
          {t(m.name, {shortId: inviteLink.inviteId.slice(0, SHORT_ID_LENGTH)})}
        </HeaderText>

        <View style={styles.metaRow}>
          <MaterialIcon
            name={isCoordinator ? 'manage-accounts' : 'people'}
            size={20}
            color={BLACK}
          />
          <BodyText variant="smallMeta" style={styles.meta}>
            {t(m.meta, {
              role: isCoordinator ? t(m.coordinator) : t(m.participant),
              timeRemaining,
            })}
          </BodyText>
        </View>
      </View>

      <MaterialIcon name="chevron-right" size={30} color={BLACK} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    color: NEW_DARK_GREY,
  },
});
