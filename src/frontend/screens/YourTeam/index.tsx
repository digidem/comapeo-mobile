import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {
  CREATOR_ROLE_ID,
  COORDINATOR_ROLE_ID,
  MEMBER_ROLE_ID,
  BLOCKED_ROLE_ID,
  LEFT_ROLE_ID,
} from '../../sharedTypes';
import type {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
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
const PAST_COLLABORATOR_ROLES = new Set([BLOCKED_ROLE_ID, LEFT_ROLE_ID]);

export const YourTeam: NativeNavigationComponent<'YourTeam'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const {projectId} = useActiveProject();
  const membersQuery = useManyMembers({projectId});
  const {data: deviceInfo} = useOwnDeviceInfo();

  const coordinators = membersQuery.data.filter(member =>
    COORDINATOR_ROLES.has(member.role.roleId),
  );

  const participants = membersQuery.data.filter(
    member => member.role.roleId === MEMBER_ROLE_ID,
  );

  const pastCollaborators = membersQuery.data.filter(member =>
    PAST_COLLABORATOR_ROLES.has(member.role.roleId),
  );

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
        <View style={styles.sectionHeader}>
          <MaterialIcon color={BLACK} size={32} name="manage-accounts" />
          <HeaderText variant="header4">{t(m.coordinators)}</HeaderText>
        </View>
        <BodyText>{t(m.coordinatorDescription)}</BodyText>
        {coordinators.map(coordinator => (
          <TeamMemberCard
            key={coordinator.deviceId}
            Icon={<DeviceIcon deviceType={coordinator.deviceType} size={30} />}
            name={coordinator.name || ''}
            thisDevice={deviceInfo.deviceId === coordinator.deviceId}
            onPress={() => {
              console.log('Pressed coordinator:', coordinator.name);
            }}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcon color={BLACK} size={32} name="people" />
          <HeaderText variant="header4">{t(m.participants)}</HeaderText>
        </View>
        <BodyText>{t(m.participantDescription)}</BodyText>
        {participants.map(participant => (
          <TeamMemberCard
            key={participant.deviceId}
            Icon={<DeviceIcon deviceType={participant.deviceType} size={30} />}
            name={participant.name || ''}
            thisDevice={deviceInfo.deviceId === participant.deviceId}
            onPress={() => {
              console.log('Pressed participant:', participant.name);
            }}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <InactivePersonIcon width={24} height={24} />
          <HeaderText variant="header4">{t(m.pastCollaborators)}</HeaderText>
        </View>
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
                numberOfLines={1}
                ellipsizeMode="tail">
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
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
  },
  pastCollaboratorName: {
    lineHeight: 18,
    includeFontPadding: false,
  },
});
