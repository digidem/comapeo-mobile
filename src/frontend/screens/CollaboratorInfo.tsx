import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {StyleSheet, View} from 'react-native';
import {BLUE_GREY} from '../lib/styles';
import {useOwnRoleInProject, useSingleMember} from '@comapeo/core-react';

import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../sharedTypes';
import {DestructiveButton} from '../sharedComponents/Buttons';

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
        {name && <HeaderText style={{margin: 20}}>{name}</HeaderText>}
        <HeaderText variant="header4">{role.name}</HeaderText>
        <BodyText>
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
            onPress={() => {
              // To Do: Navigate to Leave Project Screen
              console.log('Leave Project Screen pressed');
            }}
          />
        ) : ownRoleIsCoordinator ? (
          <DestructiveButton
            text={formatMessage(m.removeDevice)}
            fullSize={true}
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
  },
  innerBox: {
    borderRadius: 10,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
