import {StyleSheet, View} from 'react-native';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import React from 'react';
import {BLACK, WHITE} from '../../../lib/styles';
import {Button} from '../../../sharedComponents/Button';
import {DeviceNameWithIcon} from '../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../sharedComponents/RoleWithIcon';
import {DeviceType, MEMBER_ROLE_ID} from '../../../sharedTypes';
import {DeviceRole} from '../../../sharedTypes';
import {RUBIK} from '../../../lib/fonts';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.title',
    defaultMessage: 'Review Invitation',
  },
  youAreInviting: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.youAreInviting',
    defaultMessage: 'You are inviting:',
  },
  sendInvite: {
    id: '$1screen.Settings.ProjectSettings.YourTeam.ReviewAndInvite.ReviewInvitation.sendInvite',
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
        <BodyText
          variant="medium"
          style={{fontFamily: RUBIK[700], color: BLACK}}>
          {t(m.youAreInviting)}
        </BodyText>
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
        <View style={styles.flexRow}>
          <MaterialIcon name="send" size={25} color={WHITE} />
          <BodyText
            style={{color: WHITE, fontFamily: RUBIK[700], marginLeft: 10}}>
            {t(m.sendInvite)}
          </BodyText>
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
