import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useWifiName} from '../../hooks/useWifiStatus';
import {NativeNavigationComponentNoHeader} from '../../sharedTypes';
import {Text} from '../../sharedComponents/Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BLACK, WHITE} from '../../lib/styles';
import {SettingsButton} from '../ObservationsList/SettingsButton';
import {Button} from '../../sharedComponents/Button';
import {useProject, useProjectSettings} from '../../hooks/server/projects';
import {State} from '@mapeo/core/dist/sync/sync-api';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  sync: {
    id: 'screens.SyncModal.SyncView.sync',
    defaultMessage: 'Sync',
    description: 'Button to start Synchronization',
  },
  stop: {
    id: 'screens.SyncModal.SyncView.stop',
    defaultMessage: 'Stop',
    description: 'Button to stop Synchronization',
  },
  caughtUp: {
    id: 'screens.SyncModal.SyncView.caughtUp',
    defaultMessage: "You're all caught up!",
  },
  yourName: {
    id: 'screens.SyncModal.SyncView.yourName',
    defaultMessage: 'Your device name is {deviceName}',
  },
  connectedPeers: {
    id: 'screens.SyncModal.SyncView.connectedPeers',
    defaultMessage: '{numberOfDevices} Devices nearby/connected',
  },
  numberWaitingSync: {
    id: 'screens.SyncModal.SyncView.numberWaitingSync',
    defaultMessage: '{numberOfDevices} Devices',
    description: "Sentence is 'x devices' waiting to sync with you",
  },
  waitingToSync: {
    id: 'screens.SyncModal.SyncView.waitingToSync',
    defaultMessage: 'Waiting to Sync with you',
    description: "Sentence is x devices 'waiting to sync with you'",
  },
  noDevices: {
    id: 'screens.SyncModal.SyncView.noDevices',
    defaultMessage: 'No Device are Syncing',
  },
});

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
  const [connectedPeers, setConnectedPeers] = React.useState<number>(0); //this should initialize with `sync.getState().connectPeers`, but it is undefined
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasDataToSync, setHasDataToSync] = React.useState<boolean>(); //this should initialize with `sync.getState().data.dataToSync`, but it is undefined
  const {formatMessage} = useIntl();

  console.log(sync.getState()); // sync.getState() === {"_h": 0, "_i": 0, "_j": null, "_k": null, "clear": [Function anonymous]}

  React.useEffect(() => {
    const syncListener = (val: State) => {
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
          <Text style={{textAlign: 'center'}}>{projectSettings.data.name}</Text>
        )}
        {deviceInfo.data && deviceInfo.data.name && (
          <Text style={{textAlign: 'center'}}>
            {formatMessage(m.yourName, {deviceName: deviceInfo.data.name})}
          </Text>
        )}
        {connectedPeers !== undefined && (
          <View style={styles.flexRow}>
            <MaterialIcons name="wifi" size={20} color={BLACK} />
            <Text style={{marginLeft: 10}}>
              {formatMessage(m.connectedPeers, {
                numberOfDevices: connectedPeers,
              })}
            </Text>
          </View>
        )}
        {isSyncing ? (
          <View>{/* syncing here */}</View>
        ) : (
          <Text style={{textAlign: 'center'}}>devices want to sync</Text>
        )}
      </View>

      <SyncButton
        startSync={sync.start}
        stopSync={sync.stop}
        isSyncing={false}
        hasDataToSync={true}
      />
    </View>
  );
};

const SyncButton = ({
  isSyncing,
  hasDataToSync,
  stopSync,
  startSync,
}: {
  isSyncing: boolean;
  hasDataToSync?: boolean;
  stopSync: () => void;
  startSync: () => void;
}) => {
  const {formatMessage} = useIntl();
  if (isSyncing) {
    return (
      <Button variant="outlined" fullWidth onPress={stopSync}>
        <View style={styles.flexRow}>
          <MaterialIcons name="stop" color={BLACK} size={40} />
          <Text style={{fontSize: 16, marginLeft: 5}}>
            {formatMessage(m.stop)}
          </Text>
        </View>
      </Button>
    );
  }

  if (hasDataToSync === undefined) {
    return null;
  }

  if (!hasDataToSync) {
    return (
      <Button fullWidth onPress={() => {}}>
        {formatMessage(m.caughtUp)}
      </Button>
    );
  }

  return (
    <Button fullWidth onPress={startSync}>
      <View style={styles.flexRow}>
        <MaterialCommunityIcons name="lightning-bolt" color={WHITE} size={25} />
        <Text style={{fontSize: 16, marginLeft: 5, color: WHITE}}>
          {formatMessage(m.sync)}
        </Text>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
