import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import type {MemberApi} from '@comapeo/core';

import {LIGHT_GREY, MEDIUM_GREY} from '../../lib/styles';
import {DeviceNameWithIcon} from '../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../sharedComponents/RoleWithIcon';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useCreateInviteLink} from '../../hooks/useInviteLinks';
import {COORDINATOR_ROLE_ID, MEMBER_ROLE_ID} from '../../sharedTypes';
import type {NativeNavigationComponent} from '../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: '$1screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.title',
    defaultMessage: 'Select Device Role',
  },
  selectingDevice: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.selectingDevice',
    defaultMessage: 'You are selecting a role for this device:',
  },
  selectingForLink: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.selectingForLink',
    defaultMessage: 'Select a role for this Invite Link',
  },
  participantDescription: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.participantDescription',
    defaultMessage:
      'As a Participant this device can take and share observations. They cannot manage users or project details.',
  },
  coordinatorDescription: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.coordinatorDescription',
    defaultMessage:
      'As a Coordinator this device can invite and remove users, and manage project details.',
  },
});

export const SelectInviteeRole: NativeNavigationComponent<
  'SelectInviteeRole'
> = ({route, navigation}) => {
  const {formatMessage: t} = useIntl();
  const params = route.params;
  const createInviteLink = useCreateInviteLink();

  async function selectRole(roleId: MemberApi.RoleIdForNewInvite) {
    if (params.invitee === 'link') {
      const inviteLink = await createInviteLink(roleId);
      navigation.replace('InviteLinkReady', {
        ...inviteLink,
        openedFrom: 'create',
      });
      return;
    }

    const {name, deviceType, deviceId} = params;
    navigation.navigate('ReviewAndInvite', {
      name,
      deviceType,
      deviceId,
      role: roleId,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <HeaderText variant="header4">
        {params.invitee === 'link'
          ? t(m.selectingForLink)
          : t(m.selectingDevice)}
      </HeaderText>

      {params.invitee === 'device' ? <DeviceNameWithIcon {...params} /> : null}

      <View style={styles.roleOptionsContainer}>
        <RoleCard
          role="participant"
          description={t(m.participantDescription)}
          onPress={() => selectRole(MEMBER_ROLE_ID)}
        />
        <RoleCard
          role="coordinator"
          description={t(m.coordinatorDescription)}
          onPress={() => selectRole(COORDINATOR_ROLE_ID)}
        />
      </View>
    </ScrollView>
  );
};

function RoleCard({
  role,
  description,
  onPress,
}: {
  role: 'participant' | 'coordinator';
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.roleCardContentContainer,
        pressed && styles.pressed,
      ]}>
      <MaterialIcon name="radio-button-off" size={24} color={MEDIUM_GREY} />
      <View style={styles.flex}>
        <RoleWithIcon role={role} />
        <BodyText>{description}</BodyText>
      </View>
    </Pressable>
  );
}

SelectInviteeRole.navTitle = m.title;

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 40,
  },
  roleOptionsContainer: {
    gap: 20,
  },
  roleCardContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 5,
  },
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
