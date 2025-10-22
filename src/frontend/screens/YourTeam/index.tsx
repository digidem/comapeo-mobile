import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {
  CREATOR_ROLE_ID,
  COORDINATOR_ROLE_ID,
  ViewStyleProp,
  MEMBER_ROLE_ID,
} from '../../sharedTypes';
import type {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import type {MaterialIconsIconName} from '@react-native-vector-icons/material-icons';
import {BLACK} from '../../lib/styles';
import {DeviceCard} from '../../sharedComponents/DeviceCard';
import {useOwnDeviceInfo, useManyMembers} from '@comapeo/core-react';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {SecondaryButton} from '../../sharedComponents/Buttons';

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
      'Coordinators can invite devices, edit and delete data, and manage project details.',
  },
  deviceName: {
    id: 'screens.Setting.ProjectSettings.YourTeam.deviceName',
    defaultMessage: 'Device Name',
  },
  dateAdded: {
    id: 'screens.Setting.ProjectSettings.YourTeam.dateAdded',
    defaultMessage: 'Date Added',
  },
  participantDescription: {
    id: 'screens.Setting.ProjectSettings.YourTeam.participantDescription',
    defaultMessage:
      'Participants can take and share observations. They cannot manage users or project details.',
  },
});

export const YourTeam: NativeNavigationComponent<'YourTeam'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const {projectId} = useActiveProject();
  const membersQuery = useManyMembers({projectId});
  const {data: deviceInfo} = useOwnDeviceInfo();

  const coordinators = !membersQuery.data
    ? []
    : membersQuery.data.filter(
        member =>
          member.role.roleId === COORDINATOR_ROLE_ID ||
          member.role.roleId === CREATOR_ROLE_ID,
      );

  const participants = !membersQuery.data
    ? []
    : membersQuery.data.filter(member => member.role.roleId === MEMBER_ROLE_ID);

  return (
    <ScrollView style={styles.container}>
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
      <IconHeader
        iconName="manage-accounts"
        messageDescriptor={m.coordinators}
        style={{marginTop: 20}}
      />
      <BodyText style={{marginTop: 10}}>{t(m.coordinatorDescription)}</BodyText>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <BodyText style={{marginTop: 10}}>{t(m.deviceName)}</BodyText>
        <BodyText style={{marginTop: 10}}>{t(m.dateAdded)}</BodyText>
      </View>

      {coordinators.map(coordinator => (
        <DeviceCard
          key={coordinator.deviceId}
          style={{marginTop: 10}}
          name={coordinator.name || ''}
          deviceId={coordinator.deviceId}
          dateAdded={coordinator.joinedAt}
          deviceType={coordinator.deviceType}
          thisDevice={deviceInfo.deviceId === coordinator.deviceId}
        />
      ))}

      <IconHeader
        iconName="people"
        messageDescriptor={m.participants}
        style={{marginTop: 20}}
      />
      <BodyText style={{marginTop: 10}}>{t(m.participantDescription)}</BodyText>

      {participants.map(participant => (
        <DeviceCard
          key={participant.deviceId}
          style={{marginTop: 10}}
          name={participant.name || ''}
          deviceId={participant.deviceId}
          deviceType={participant.deviceType}
          dateAdded={participant.joinedAt}
          thisDevice={deviceInfo.deviceId === participant.deviceId}
        />
      ))}
      <View style={{marginBottom: 40}} />
    </ScrollView>
  );
};

YourTeam.navTitle = m.title;

const IconHeader = ({
  iconName,
  messageDescriptor,
  style,
}: {
  iconName: MaterialIconsIconName;
  messageDescriptor: MessageDescriptor;
  style?: ViewStyleProp;
}) => {
  const {formatMessage: t} = useIntl();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}>
      <MaterialIcon
        color={BLACK}
        size={32}
        name={iconName}
        style={{marginRight: 10}}
      />
      <HeaderText variant="header4">{t(messageDescriptor)}</HeaderText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
