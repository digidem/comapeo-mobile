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

// <MaterialIcon name={'people'} size={25} color={BLACK} />
// <MaterialCommunity name="account-cog" size={25} color={BLACK} />
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
  particpant: {
    id: 'screen.Settings.ProjectSettings.YourTeam.ReviewInvitation.particpant',
    defaultMessage: 'Particpant',
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
  return (
    <View style={styles.container}>
      <View>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          {t(m.youAreInviting)}
        </Text>
        <DeviceNameWithIcon {...rest} style={{marginTop: 20}} />
        <RoleWithIcon style={{marginTop: 20}} role={role} />
      </View>
      <Button
        fullWidth
        onPress={() => {
          mockSendInviteApi();
          navigation.navigate('WaitingForInviteAccept', {...route.params});
        }}>
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

function mockSendInviteApi() {}
