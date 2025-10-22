import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {StyleSheet, View} from 'react-native';
import {BLACK, BLUE_GREY, NEW_DARK_GREY} from '../lib/styles';
import {useOwnRoleInProject, useSingleMember} from '@comapeo/core-react';

import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../sharedTypes';
import {DestructiveButton} from '../sharedComponents/Buttons';
import {DeviceIcon} from '../sharedComponents/DeviceNameWithIcon';
import MaterialIcon from '@react-native-vector-icons/material-icons';

const m = defineMessages({
  navTitle: {
    id: 'screens.CollaboratorInfo.navTitle',
    defaultMessage: 'Collaborator Info',
  },
  addedOn: {
    id: 'screens.CollaboratorInfo.addedOn',
    defaultMessage: 'Added on {date}',
  },
  removeDevice: {
    id: 'screens.CollaboratorInfo.removeDevice',
    defaultMessage: 'Remove Device',
  },
  leaveProject: {
    id: 'screens.CollaboratorInfo.leaveProject',
    defaultMessage: 'Leave Project',
  },
  participant: {
    id: 'screens.CollaboratorInfo.participant',
    defaultMessage: 'Participant',
  },
  coordinator: {
    id: 'screens.CollaboratorInfo.coordinator',
    defaultMessage: 'Coordinator',
  },
});

export const CollaboratorInfo: NativeNavigationComponent<
  'CollaboratorInfo'
> = ({route}) => {
  const {projectId} = useActiveProject();
  const {formatDate, formatMessage} = useIntl();
  const {
    data: {name, role, joinedAt},
  } = useSingleMember({projectId, deviceId: route.params.deviceId});

  const {data: ownRole} = useOwnRoleInProject({projectId});

  const isCoordinator =
    role.roleId === COORDINATOR_ROLE_ID || role.roleId === CREATOR_ROLE_ID;

  const ownRoleIsCoordinator =
    ownRole.roleId === COORDINATOR_ROLE_ID ||
    ownRole.roleId === CREATOR_ROLE_ID;

  return (
    <View style={styles.container}>
      <View style={styles.innerBox}>
        <DeviceIcon deviceType={route.params.deviceType} size={80} />
        {name && <HeaderText>{name}</HeaderText>}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialIcon
            color={BLACK}
            size={32}
            name={isCoordinator ? 'manage-accounts' : 'people'}
            style={{marginRight: 10}}
          />
          <HeaderText variant="header4">
            {formatMessage(isCoordinator ? m.coordinator : m.participant)}
          </HeaderText>
        </View>
        <BodyText style={{marginTop: 40, color: NEW_DARK_GREY}}>
          {formatMessage(m.addedOn, {
            date: formatDate(joinedAt, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          })}
        </BodyText>
      </View>
      {!isCoordinator &&
        (route.params.isOwnDevice ? (
          //this should be SecondaryDestructiveButton
          <DestructiveButton
            text={formatMessage(m.leaveProject)}
            fullSize={true}
            style={styles.buttonStyle}
            onPress={() => {
              // To Do: Navigate to Leave Project Screen
              console.log('Leave Project Screen pressed');
            }}
          />
        ) : ownRoleIsCoordinator ? (
          <DestructiveButton
            text={formatMessage(m.removeDevice)}
            fullSize={true}
            style={styles.buttonStyle}
            onPress={() => {
              // To Do: navigate to remove device success screen
              console.log('Remove Device pressed');
            }}
          />
        ) : null)}
    </View>
  );
};

CollaboratorInfo.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  innerBox: {
    borderRadius: 10,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {alignSelf: 'center', marginTop: 20},
});
