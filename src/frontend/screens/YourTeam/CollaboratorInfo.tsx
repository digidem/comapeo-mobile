import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {StyleSheet, View} from 'react-native';
import {BLACK, BLUE_GREY, NEW_DARK_GREY} from '../../lib/styles';
import {useOwnRoleInProject, useSingleMember} from '@comapeo/core-react';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../../sharedTypes';
import {SecondaryDestructiveButton} from '../../sharedComponents/Buttons';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {useLayoutEffect} from 'react';
import {isActiveArchiveServerMember} from '../../hooks/server/projects';
import {DeviceIcon} from '../../sharedComponents/DeviceIcon';

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
  thisDevice: {
    id: 'screens.CollaboratorInfo.thisDevice',
    defaultMessage: 'This Device',
  },
});

export const CollaboratorInfo: NativeNavigationComponent<
  'CollaboratorInfo'
> = ({route, navigation}) => {
  const {projectId} = useActiveProject();
  const isOwnDevice = route.params.isOwnDevice;
  const {formatDate, formatMessage} = useIntl();
  const {data: member} = useSingleMember({
    projectId,
    deviceId: route.params.deviceId,
  });
  const {name, role, joinedAt} = member;
  const isArchiveServer = isActiveArchiveServerMember(member);

  const {data: ownRole} = useOwnRoleInProject({projectId});

  useLayoutEffect(() => {
    if (isOwnDevice) {
      navigation.setOptions({title: formatMessage(m.thisDevice)});
    }
  }, [navigation, isOwnDevice, formatMessage]);

  const isCoordinator =
    role.roleId === COORDINATOR_ROLE_ID || role.roleId === CREATOR_ROLE_ID;

  const ownRoleIsCoordinator =
    ownRole.roleId === COORDINATOR_ROLE_ID ||
    ownRole.roleId === CREATOR_ROLE_ID;

  return (
    <View style={styles.container}>
      <View style={styles.innerBox}>
        <DeviceIcon deviceType={route.params.deviceType} size={80} />
        {name && (
          <HeaderText variant="header2" style={{textAlign: 'center'}}>
            {name}
          </HeaderText>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialIcon
            color={BLACK}
            size={24}
            name={isCoordinator ? 'manage-accounts' : 'people'}
            style={{marginRight: 10}}
          />
          <HeaderText variant="header4">
            {formatMessage(isCoordinator ? m.coordinator : m.participant)}
          </HeaderText>
        </View>
        <BodyText style={{marginTop: 34, color: NEW_DARK_GREY}}>
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
        !isArchiveServer &&
        (isOwnDevice ? (
          <SecondaryDestructiveButton
            text={formatMessage(m.leaveProject)}
            fullSize={true}
            style={styles.buttonStyle}
            renderIcon={({size, color}) => (
              <MaterialDesignIcons size={size} color={color} name="export" />
            )}
            onPress={() => {
              navigation.navigate('LeaveProject');
            }}
          />
        ) : ownRoleIsCoordinator ? (
          <SecondaryDestructiveButton
            text={formatMessage(m.removeDevice)}
            fullSize={true}
            style={styles.buttonStyle}
            renderIcon={({size, color}) => (
              <MaterialIcon size={size} color={color} name="person-remove" />
            )}
            onPress={() => {
              navigation.navigate('RemoveDevice', {
                deviceId: route.params.deviceId,
                deviceName: name || '',
              });
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
    padding: 20,
    gap: 12,
  },
  buttonStyle: {alignSelf: 'center', marginTop: 20},
});
