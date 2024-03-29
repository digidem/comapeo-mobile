import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../../sharedTypes';
import {ScrollView, StyleSheet, View} from 'react-native';
import WifiIcon from '../../../../images/WifiIcon.svg';
import {Text} from '../../../../sharedComponents/Text';
import {DeviceCard} from '../../../../sharedComponents/DeviceCard';
import {useLocalDiscoveryState} from '../../../../hooks/useLocalDiscoveryState';
import {useLocalPeers} from '../../../../hooks/useLocalPeers';
import {useProjectMembers} from '../../../../hooks/server/projects';

const m = defineMessages({
  title: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectDevice.title',
    defaultMessage: 'Select Device to Invite',
  },
  notSeeingDevice: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectDevice.notSeeingDevice',
    defaultMessage: 'Not seeing a Device?',
  },
  sameWifi: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectDevice.sameWifi',
    defaultMessage: 'Make sure both devices are on the same wifi network ',
  },
  sameVersion: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectDevice.sameVersion',
    defaultMessage: 'Make sure both devices are on the same version of Mapeo',
  },
});

export const SelectDevice: NativeNavigationComponent<'SelectDevice'> = ({
  navigation,
}) => {
  const ssid = useLocalDiscoveryState(state => state.ssid);
  const {formatMessage: t} = useIntl();
  const projectMembers = useProjectMembers();
  const devices = useLocalPeers();
  const nonMemberDevices = !projectMembers.data
    ? devices
    : devices.filter(
        device =>
          !projectMembers.data.some(
            member => member.deviceId === device.deviceId,
          ),
      );

  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <WifiIcon style={{marginRight: 10}} width={30} height={30} />
        <Text>{ssid}</Text>
      </View>
      <Text style={{marginTop: 10}}>{t(m.notSeeingDevice)}</Text>
      <Text style={{marginLeft: 10}}>{`\u2022 ${t(m.sameWifi)}`}</Text>
      <Text style={{marginLeft: 10}}>{`\u2022 ${t(m.sameVersion)}`}</Text>
      {/* Divider */}
      <View style={{marginTop: 20}}></View>

      {/* List available devices here */}
      {nonMemberDevices.map(device => {
        const name = device.name;
        const deviceId = device.deviceId;
        // this is not exposed yet
        const deviceType = 'mobile';
        return (
          <DeviceCard
            key={deviceId}
            style={{marginBottom: 10}}
            name={name || ''}
            deviceType={deviceType}
            deviceId={deviceId}
            onPress={() =>
              navigation.navigate('SelectInviteeRole', {
                name: name || '',
                deviceId: deviceId,
                deviceType: deviceType,
              })
            }
          />
        );
      })}
    </ScrollView>
  );
};

SelectDevice.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
});
