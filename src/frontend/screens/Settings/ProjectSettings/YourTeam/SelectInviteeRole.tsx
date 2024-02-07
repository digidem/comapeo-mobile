import {StyleSheet, View} from 'react-native';
import {
  NativeNavigationComponent,
  ViewStyleProp,
} from '../../../../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../../sharedComponents/Text';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {DARK_GREY, LIGHT_GREY} from '../../../../lib/styles';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DeviceNameWithIcon} from '../../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../../sharedComponents/RoleWithIcon';

export const COORDINATOR_ROLE_ID = 'f7c150f5a3a9a855';
export const MEMBER_ROLE_ID = '012fd2d431c0bf60';

const m = defineMessages({
  title: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.title',
    defaultMessage: 'Select a Role',
  },
  selectingDevice: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.selectingDevice',
    defaultMessage: 'You are selecting a role for this device:',
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
  console.log({route});
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
        {t(m.selectingDevice)}
      </Text>
      <DeviceNameWithIcon {...route.params} style={{marginTop: 10}} />
      <RoleCard
        style={{marginTop: 20}}
        role="participant"
        onPress={() =>
          navigation.navigate('ReviewAndInvite', {
            ...route.params,
            role: MEMBER_ROLE_ID,
          })
        }
      />
      <RoleCard
        style={{marginTop: 10}}
        role="coordinator"
        onPress={() =>
          navigation.navigate('ReviewAndInvite', {
            ...route.params,
            role: COORDINATOR_ROLE_ID,
          })
        }
      />
    </View>
  );
};

type RoleCardProps = {
  role: 'participant' | 'coordinator';
  onPress: () => void;
  style?: ViewStyleProp;
};

export const RoleCard = ({role, style, onPress}: RoleCardProps) => {
  const {formatMessage} = useIntl();
  return (
    <TouchableOpacity
      style={[styles.flexRow, styles.cardContainer, style]}
      onPress={onPress}>
      <MaterialIcon name="radio-button-off" size={25} color={DARK_GREY} />
      <View style={{marginLeft: 10}}>
        <RoleWithIcon role={role} />
        <Text>
          {formatMessage(
            role === 'coordinator'
              ? m.coordinatorDescription
              : m.participantDescription,
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

SelectInviteeRole.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    height: '100%',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    padding: 10,
    borderRadius: 5,
  },
});
