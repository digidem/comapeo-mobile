import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useWifiName} from '../../hooks/useWifiStatus';
import {NativeNavigationComponentNoHeader} from '../../sharedTypes';
import {Text} from '../../sharedComponents/Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BLACK} from '../../lib/styles';
import {SettingsButton} from '../ObservationsList/SettingsButton';
import {Button} from '../../sharedComponents/Button';
import {useProject} from '../../hooks/server/projects';

export const Sync: NativeNavigationComponentNoHeader<'Sync'> = ({
  navigation,
}) => {
  const ssid = useWifiName();
  const project = useProject();

  React.useLayoutEffect(() => {
    if (ssid)
      navigation.setOptions({
        headerTitle: () => (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="wifi" size={20} color={BLACK} />
            <Text style={{marginLeft: 5}}>{ssid}</Text>
          </View>
        ),
        headerRight: () => <SettingsButton />,
      });
  }, [ssid]);

  React.useLayoutEffect(() => {
    if (!ssid) {
      navigation.navigate('NoWifi');
    }
  }, [ssid, navigation]);

  return (
    <View style={styles.container}>
      <View>
        <Text>Project Name Here</Text>
        <Text>Your device name is </Text>
        <MaterialIcons name="wifi" size={20} color={BLACK} />
      </View>
      <Button fullWidth onPress={() => {}}>
        {}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    padding: 20,
  },
});
