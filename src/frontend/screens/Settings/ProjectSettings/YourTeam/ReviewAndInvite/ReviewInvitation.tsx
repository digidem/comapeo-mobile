import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {WHITE} from '../../../../../lib/styles';
import {Button} from '../../../../../sharedComponents/Button';
import {DeviceNameWithIcon} from '../../../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../../../sharedComponents/RoleWithIcon';
import {DeviceRole, DeviceType} from '../../../../../sharedTypes';
import {MEMBER_ROLE_ID} from '@mapeo/core/dist/roles';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.title',
    defaultMessage: 'Review Invitation',
  },
  youAreInviting: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.youAreInviting',
    defaultMessage: 'You are inviting:',
  },
  coordinator: {
    id: 'screen.Settings.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: 'screen.Settings.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.participant',
    defaultMessage: 'Participant',
  },
  sendInvite: {
    id: 'screen.Settings.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.sendInvite',
    defaultMessage: 'Send Invite',
  },
});

type ReviewInvitationProps = {
  name: string;
  role: DeviceRole;
  deviceId: string;
  deviceType: DeviceType;
  sendInvite: () => void;
};

export const ReviewInvitation = ({
  name,
  role,
  deviceId,
  sendInvite,
  deviceType,
}: ReviewInvitationProps) => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          {t(m.youAreInviting)}
        </Text>
        <DeviceNameWithIcon
          name={name}
          deviceId={deviceId}
          deviceType={deviceType}
          style={{marginTop: 20}}
        />
        <RoleWithIcon
          style={{marginTop: 20}}
          role={role === MEMBER_ROLE_ID ? 'participant' : 'coordinator'}
        />
      </View>
      <Button fullWidth onPress={sendInvite}>
        <View style={[styles.flexRow]}>
          <MaterialIcon name="send" size={25} color={WHITE} />
          <Text style={{color: WHITE, fontWeight: 'bold', marginLeft: 10}}>
            {t(m.sendInvite)}
          </Text>
        </View>
      </Button>
    </View>
  );
};

ReviewInvitation.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
