import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import type {MemberApi} from '@comapeo/core';

import {BLACK, LIGHT_GREY, MEDIUM_GREY} from '../../lib/styles';
import {DeviceNameWithIcon} from '../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../sharedComponents/RoleWithIcon';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useCreateInviteLink} from '@comapeo/core-react';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
import {parseInviteLink} from '../../lib/inviteLinks';
import {toError} from '../../utils/errors';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
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
  const {projectId} = useActiveProject();

  function showError(error: unknown) {
    navigation.navigate('ErrorBottomSheet', {
      error: toError(error, 'Could not create the invite link'),
    });
  }

  function selectRole(roleId: MemberApi.RoleIdForNewInvite) {
    if (params.invitee === 'link') {
      createInviteLink.mutate(
        {projectId, roleId},
        {
          onSuccess: url => {
            const inviteLink = parseInviteLink(url);
            if (!inviteLink) {
              showError(new Error(`Could not parse new invite link: ${url}`));
              return;
            }

            navigation.replace('InviteLinkReady', {
              url,
              inviteId: inviteLink.inviteIdString,
              roleId: inviteLink.roleId,
              expiresAt: inviteLink.expiresAt,
              openedFrom: 'create',
            });
          },
          onError: showError,
        },
      );
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

  // Creating a link is a round trip to the backend. Without this the role cards
  // stay tappable and each extra tap creates another link.
  if (createInviteLink.status === 'pending') {
    return <FullScreenCenteredLoader />;
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {params.invitee === 'link' ? (
        <BodyText variant="medium" style={styles.linkPrompt}>
          {t(m.selectingForLink)}
        </BodyText>
      ) : (
        <BodyText weight={700} variant="medium" style={styles.devicePrompt}>
          {t(m.selectingDevice)}
        </BodyText>
      )}

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
        <BodyText style={styles.roleDescription}>{description}</BodyText>
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
  linkPrompt: {
    textAlign: 'center',
  },
  devicePrompt: {
    color: BLACK,
  },
  roleDescription: {
    color: BLACK,
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
