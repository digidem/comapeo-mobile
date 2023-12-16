import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useWifiName} from '../../hooks/useWifiStatus';
import {NativeNavigationComponentNoHeader} from '../../sharedTypes';
import {Text} from '../../sharedComponents/Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BLACK} from '../../lib/styles';
import {SettingsButton} from '../ObservationsList/SettingsButton';
import {Button} from '../../sharedComponents/Button';
import {useProject, useProjectSettings} from '../../hooks/server/projects';
import {State} from '@mapeo/core/dist/sync/sync-api';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';

/**
 *
 * States needed:
 * - syncing
 * - not syncing
 *    - devices waiting to sync
 *    - data up to date
 */

export const Sync: NativeNavigationComponentNoHeader<'Sync'> = ({
  navigation,
}) => {
  const ssid = useWifiName();
  const sync = useProject().$sync;
  const projectSettings = useProjectSettings();
  const deviceInfo = useDeviceInfo();
  const [connectedPeers, setConnectedPeers] = React.useState<number>();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasDataToSync, setHasDataToSync] = React.useState<boolean>();

  console.log({isSyncing});
  React.useEffect(() => {
    const syncListener = (val: State) => {
      console.log(val);
      setConnectedPeers(val.connectedPeers);
      setIsSyncing(val.data.syncing);
      setHasDataToSync(val.data.dataToSync);
    };

    sync.addListener('sync-state', syncListener);

    return () => {
      sync.removeListener('sync-state', syncListener);
    };
  }, [sync]);

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
        {projectSettings.data && projectSettings.data.name && (
          <Text>{projectSettings.data.name}</Text>
        )}
        {deviceInfo.data && deviceInfo.data.name && (
          <Text>Your device name is {deviceInfo.data.name}</Text>
        )}
        <MaterialIcons name="wifi" size={20} color={BLACK} />
        {connectedPeers !== undefined && (
          <Text>{`Connected Peers: ${connectedPeers}`}</Text>
        )}
        {isSyncing ? (
          <View>{/* syncing here */}</View>
        ) : (
          <View>
            {hasDataToSync ? (
              <Text>devices want to sync</Text>
            ) : (
              <Text>No data to sync</Text>
            )}
          </View>
        )}
      </View>

      <SyncButton isSyncing={false} hasDataToSync={true} />
    </View>
  );
};

const SyncButton = ({
  isSyncing,
  hasDataToSync,
}: {
  isSyncing: boolean;
  hasDataToSync?: boolean;
}) => {
  const sync = useProject().$sync;
  if (isSyncing) {
    return <Button onPress={() => sync.stop()}>Stop</Button>;
  }

  if (hasDataToSync === undefined) {
    return null;
  }

  if (!hasDataToSync) {
    return <Button onPress={() => {}}>You're all caught up</Button>;
  }

  return <Button onPress={() => sync.start()}>Sync</Button>;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    padding: 20,
  },
});
