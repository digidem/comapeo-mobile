import {StyleSheet, View} from 'react-native';
import {
  NativeNavigationComponent,
  ViewStyleProp,
} from '../../../../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../../sharedComponents/Text';
import DeviceMobile from '../../../../images/DeviceMobile.svg';
import DeviceDesktop from '../../../../images/DeviceDesktop.svg';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {BLACK, DARK_GREY, LIGHT_GREY} from '../../../../lib/styles';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const m = defineMessages({
  title: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.title',
    defaultMessage: 'Select a Role',
  },
  selectingDevice: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.selectingDevice',
    defaultMessage: 'You are selecting a role for this device:',
  },
  particpant: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.particpant',
    defaultMessage: 'Particpant',
  },
  particpantDescription: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.particpantDescription',
    defaultMessage:
      'As a Participant this device can take and share observations. They cannot manage users or project details.',
  },
  coordinator: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.coordinator',
    defaultMessage: 'Coordinator',
  },
  coordinatorDescription: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectInviteeRole.coordinatorDescription',
    defaultMessage:
      'As a Coordinator this device can invite and remove users, and manage project details.',
  },
});

export const SelectInviteeRole: NativeNavigationComponent<
  'SelectInviteeRole'
> = ({route}) => {
  const {deviceType, deviceId, name} = route.params;
  const {formatMessage: t} = useIntl();
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
        {t(m.selectingDevice)}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        {deviceType === 'mobile' ? <DeviceMobile /> : <DeviceDesktop />}
        <View style={{justifyContent: 'center', marginLeft: 10}}>
          <Text>{name}</Text>
          {deviceId && <Text>{deviceId}</Text>}
        </View>
      </View>
      <RoleCard
        style={{marginTop: 20}}
        icon={<MaterialIcon name={'people'} size={25} color={BLACK} />}
        role={t(m.particpant)}
        roleDescription={t(m.particpantDescription)}
      />
      <RoleCard
        style={{marginTop: 10}}
        icon={<MaterialCommunity name="account-cog" size={25} color={BLACK} />}
        role={t(m.coordinator)}
        roleDescription={t(m.coordinatorDescription)}
      />
    </View>
  );
};

type RoleCardProps = {
  icon: React.ReactNode;
  role: string;
  roleDescription: string;
  style?: ViewStyleProp;
};

export const RoleCard = ({
  icon,
  role,
  roleDescription,
  style,
}: RoleCardProps) => {
  return (
    <TouchableOpacity style={[styles.flexRow, styles.cardContainer, style]}>
      <MaterialIcon name="radio-button-off" size={25} color={DARK_GREY} />
      <View style={{marginLeft: 10}}>
        <View style={styles.flexRow}>
          {icon}
          <Text style={{marginLeft: 10}}>{role}</Text>
        </View>
        <Text>{roleDescription}</Text>
      </View>
    </TouchableOpacity>
  );
};

SelectInviteeRole.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
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
