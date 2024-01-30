import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../../sharedTypes';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {WHITE} from '../../../../lib/styles';
import {Button} from '../../../../sharedComponents/Button';
import {DeviceNameWithIcon} from '../../../../sharedComponents/DeviceNameWithIcon';
import {RoleWithIcon} from '../../../../sharedComponents/RoleWithIcon';
import {useProject} from '../../../../hooks/server/projects';
import {WaitingForInviteAccept} from './WaitingForInviteAccept';
import {useBottomSheetModal} from '../../../../sharedComponents/BottomSheetModal';
import {MEMBER_ROLE_ID} from './SelectInviteeRole';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewInvitation.title',
    defaultMessage: 'Review Invitation',
  },
  youAreInviting: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewInvitation.youAreInviting',
    defaultMessage: 'You are inviting:',
  },
  coordinator: {
    id: 'screen.Settings.ProjectSettings.YourTeam.ReviewInvitation.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: 'screen.Settings.ProjectSettings.YourTeam.ReviewInvitation.participant',
    defaultMessage: 'Participant',
  },
  sendInvite: {
    id: 'screen.Settings.ProjectSettings.YourTeam.ReviewInvitation.sendInvite',
    defaultMessage: 'Send Invite',
  },
});

export const ReviewInvitation: NativeNavigationComponent<
  'ReviewInvitation'
> = ({route, navigation}) => {
  const {formatMessage: t} = useIntl();
  const {role, ...rest} = route.params;
  const [inviteSent, setInviteSent] = React.useState(false);
  const {openSheet, ...restBottomSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const project = useProject();

  function sendInvite() {
    setInviteSent(true);
    project.$member
      .invite(rest.deviceId, {roleId: role})
      .then(val => navigation.navigate('InviteAccepted', {...route.params}))
      .catch(err => openSheet());
  }

  if (inviteSent) {
    return <WaitingForInviteAccept {...restBottomSheet} />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          {t(m.youAreInviting)}
        </Text>
        <DeviceNameWithIcon {...rest} style={{marginTop: 20}} />
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
