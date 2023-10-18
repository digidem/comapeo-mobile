import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../../sharedTypes';
import {ScrollView, StyleSheet, View} from 'react-native';
import useWifiStatus from '../../../../hooks/useWifiStatus';
import WifiIcon from '../../../../images/WifiIcon.svg';
import {Text} from '../../../../sharedComponents/Text';
import {DeviceCard} from '../../../../sharedComponents/DeviceCard';

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
  const {ssid} = useWifiStatus();
  const {formatMessage: t} = useIntl();
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
      <DeviceCard
        style={{marginBottom: 10}}
        name="Joy"
        deviceType="mobile"
        deviceId="Android13"
        onPress={() =>
          navigation.navigate('SelectInviteeRole', {
            name: 'Joy',
            deviceId: 'Android13',
            deviceType: 'mobile',
          })
        }
      />
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
