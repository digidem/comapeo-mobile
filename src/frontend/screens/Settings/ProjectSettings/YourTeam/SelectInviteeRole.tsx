import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {LIGHT_GREY, MEDIUM_GREY} from '../../../../lib/styles';
import {DeviceNameWithIcon} from '../../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../../sharedComponents/RoleWithIcon';
import {Text} from '../../../../sharedComponents/Text';
import {COORDINATOR_ROLE_ID, MEMBER_ROLE_ID} from '../../../../sharedTypes';
import type {NativeNavigationComponent} from '../../../../sharedTypes/navigation';

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

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.descriptionText}>{t(m.selectingDevice)}</Text>

      <DeviceNameWithIcon {...route.params} />

      <View style={styles.roleOptionsContainer}>
        <RoleCard
          role="participant"
          onPress={() =>
            navigation.navigate('ReviewAndInvite', {
              ...route.params,
              role: MEMBER_ROLE_ID,
            })
          }
        />
        <RoleCard
          role="coordinator"
          onPress={() =>
            navigation.navigate('ReviewAndInvite', {
              ...route.params,
              role: COORDINATOR_ROLE_ID,
            })
          }
        />
      </View>
    </ScrollView>
  );
};

type RoleCardProps = {
  role: 'participant' | 'coordinator';
  onPress: () => void;
};

const RoleCard = ({role, onPress}: RoleCardProps) => {
  const {formatMessage} = useIntl();
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.roleCardContentContainer}>
        <MaterialIcon name="radio-button-off" size={24} color={MEDIUM_GREY} />
        <View style={styles.flex}>
          <RoleWithIcon role={role} />
          <Text>
            {formatMessage(
              role === 'coordinator'
                ? m.coordinatorDescription
                : m.participantDescription,
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

SelectInviteeRole.navTitle = m.title;

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 40,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
