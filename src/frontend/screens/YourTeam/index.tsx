import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {
  CREATOR_ROLE_ID,
  COORDINATOR_ROLE_ID,
  ViewStyleProp,
  MEMBER_ROLE_ID,
  BLOCKED_ROLE_ID,
  LEFT_ROLE_ID,
  NO_ROLE_ID,
} from '../../sharedTypes';
import type {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import type {MaterialIconsIconName} from '@react-native-vector-icons/material-icons';
import {BLACK, NEW_DARK_GREY} from '../../lib/styles';
import {TeamMemberCard} from './TeamMemberCard';
import {useOwnDeviceInfo, useManyMembers} from '@comapeo/core-react';
import InactivePersonIcon from '../../images/NoPeople.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {DeviceIcon} from '../../sharedComponents/DeviceIcon';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.YourTeam.title',
    defaultMessage: 'Your Team',
  },
  inviteDevice: {
    id: 'screens.Setting.ProjectSettings.YourTeam.inviteDevice',
    defaultMessage: 'Invite Device',
  },
  coordinators: {
    id: 'screens.Setting.ProjectSettings.YourTeam.coordinators',
    defaultMessage: 'Coordinators',
  },
  participants: {
    id: 'screens.Setting.ProjectSettings.YourTeam.participants',
    defaultMessage: 'Participants',
  },
  coordinatorDescription: {
    id: 'screens.Setting.ProjectSettings.YourTeam.coordinatorDescription',
    defaultMessage:
      'Can invite devices, edit and delete data, and manage project details.',
  },
  participantDescription: {
    id: 'screens.Setting.ProjectSettings.YourTeam.participantDescription',
    defaultMessage:
      'Can take and share observations but not manage users or project details.',
  },
  pastCollaborators: {
    id: 'screens.Setting.ProjectSettings.YourTeam.pastCollaborators',
    defaultMessage: 'Past Collaborators',
  },
  pastCollaboratorsDescription: {
    id: 'screens.Setting.ProjectSettings.YourTeam.pastCollaboratorsDescription',
    defaultMessage: 'Devices no longer contributing to this project.',
  },
});

const COORDINATOR_ROLES = new Set([COORDINATOR_ROLE_ID, CREATOR_ROLE_ID]);
const PAST_COLLABORATOR_ROLES = new Set([
  BLOCKED_ROLE_ID,
  LEFT_ROLE_ID,
  NO_ROLE_ID,
]);

export const YourTeam: NativeNavigationComponent<'YourTeam'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const {projectId} = useActiveProject();
  const membersQuery = useManyMembers({projectId});
  const {data: deviceInfo} = useOwnDeviceInfo();

  const members = membersQuery.data || [];

  const coordinators = members.filter(member =>
    COORDINATOR_ROLES.has(member.role.roleId),
  );

  const participants = members.filter(
    member => member.role.roleId === MEMBER_ROLE_ID,
  );

  const pastCollaborators = members.filter(member =>
    PAST_COLLABORATOR_ROLES.has(member.role.roleId),
  );

  // Uncomment to preview past collaborators UI, but will see typescript errors
  // pastCollaborators = [
  //   {
  //     deviceId: 'fake-1',
  //     name: 'Saguaro',
  //     deviceType: 'mobile' as const,
  //     role: {roleId: LEFT_ROLE_ID},
  //   },
  //   {
  //     deviceId: 'fake-2',
  //     name: 'Desert Willow',
  //     deviceType: 'tablet' as const,
  //     role: {roleId: BLOCKED_ROLE_ID},
  //   },
  //   {
  //     deviceId: 'fake-3',
  //     name: 'Palo Verde',
  //     deviceType: 'desktop' as const,
  //     role: {roleId: NO_ROLE_ID},
  //   },
  // ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!deviceInfo ||
      !coordinators.some(
        coordinator => coordinator.deviceId === deviceInfo.deviceId,
      ) ? null : (
        <SecondaryButton
          testID="PROJECT.invite-device-btn"
          fullSize={true}
          style={{alignSelf: 'center'}}
          onPress={() => {
            navigation.navigate('SelectDevice');
          }}
          renderIcon={({color, size}) => (
            <MaterialIcon color={color} size={size} name="person-add" />
          )}
          text={t(m.inviteDevice)}
        />
      )}

      <View style={styles.section}>
        <IconHeader icon="manage-accounts" messageDescriptor={m.coordinators} />
        <BodyText>{t(m.coordinatorDescription)}</BodyText>
        {coordinators.map(coordinator => (
          <TeamMemberCard
            key={coordinator.deviceId}
            name={coordinator.name || ''}
            deviceType={coordinator.deviceType}
            thisDevice={deviceInfo.deviceId === coordinator.deviceId}
            onPress={() => {
              console.log('Pressed coordinator:', coordinator.name);
            }}
          />
        ))}
      </View>

      <View style={styles.section}>
        <IconHeader icon="people" messageDescriptor={m.participants} />
        <BodyText>{t(m.participantDescription)}</BodyText>
        {participants.map(participant => (
          <TeamMemberCard
            key={participant.deviceId}
            name={participant.name || ''}
            deviceType={participant.deviceType}
            thisDevice={deviceInfo.deviceId === participant.deviceId}
            onPress={() => {
              console.log('Pressed participant:', participant.name);
            }}
          />
        ))}
      </View>

      <View style={styles.section}>
        <IconHeader
          icon={<InactivePersonIcon width={24} height={24} />}
          messageDescriptor={m.pastCollaborators}
        />
        <BodyText variant="tinyMeta">
          {t(m.pastCollaboratorsDescription)}
        </BodyText>
        {pastCollaborators.map(collaborator => (
          <View key={collaborator.deviceId} style={styles.pastCollaboratorCard}>
            <DeviceIcon
              deviceType={collaborator.deviceType}
              size={30}
              iconColor={NEW_DARK_GREY}
            />
            <View style={styles.pastCollaboratorText}>
              <HeaderText
                variant="header6"
                style={styles.pastCollaboratorName}
                numberOfLines={2}>
                {collaborator.name || ''}
              </HeaderText>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

YourTeam.navTitle = m.title;

const IconHeader = ({
  icon,
  messageDescriptor,
  style,
}: {
  icon: MaterialIconsIconName | React.ReactElement;
  messageDescriptor: MessageDescriptor;
  style?: ViewStyleProp;
}) => {
  const {formatMessage: t} = useIntl();

  const iconElement =
    typeof icon === 'string' ? (
      <MaterialIcon
        color={BLACK}
        size={32}
        name={icon as MaterialIconsIconName}
        style={{marginRight: 10}}
      />
    ) : (
      icon
    );

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 15,
        },
        style,
      ]}>
      {iconElement}
      <HeaderText variant="header4">{t(messageDescriptor)}</HeaderText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  content: {
    gap: 20,
    paddingBottom: 40,
  },
  section: {
    gap: 10,
  },
  pastCollaboratorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 15,
    height: 60,
  },
  pastCollaboratorText: {
    flex: 1,
    minWidth: 0,
  },
  pastCollaboratorName: {
    lineHeight: 18,
    includeFontPadding: false,
  },
});
