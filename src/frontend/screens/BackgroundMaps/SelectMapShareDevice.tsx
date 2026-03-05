import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import * as Sentry from '@sentry/react-native';

import {useSendMapShare, useSyncState} from '@comapeo/core-react';
import {type MapeoClientApi} from '@comapeo/ipc';
import {toError} from '../../utils/errors';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import WifiIcon from '../../images/WifiIcon.svg';
import {DeviceNameWithIcon} from '../../sharedComponents/DeviceNameWithIcon';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {LIGHT_GREY} from '../../lib/styles';
import {ExhaustivenessError} from '../../lib/ExhaustivenessError';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useInitiallyConnectedPeers} from '../YourTeam/useInitiallyConnectedPeers';

type PublicPeerInfo = Awaited<
  ReturnType<MapeoClientApi['listLocalPeers']>
>[number];

export function getSelectableDevicesForMapShare({
  peers,
  syncState,
}: {
  peers: PublicPeerInfo[];
  syncState: ReturnType<typeof useSyncState>;
}): PublicPeerInfo[] {
  if (!syncState) return [];

  const connectedDeviceIds = Object.keys(syncState.remoteDeviceSyncState);

  return peers.filter(device => {
    return connectedDeviceIds.includes(device.deviceId);
  });
}

const m = defineMessages({
  title: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectDevice.titleMapShare',
    defaultMessage: 'Select Device',
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
    defaultMessage: 'Make sure both devices are on the same version of CoMapeo',
  },
  sameProject: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectDevice.sameProject',
    defaultMessage: 'Make sure both devices have the same project open',
  },
});

export const SelectMapShareDevice = ({
  navigation,
}: NativeRootNavigationProps<'SelectMapShareDevice'>) => {
  const ssid = useLocalDiscoveryState(state => state.ssid);
  const {formatMessage: t} = useIntl();

  const availablePeers = useInitiallyConnectedPeers();
  const {projectId} = useActiveProject();
  const syncState = useSyncState({projectId});
  const {mutateAsync: sendMapShare} = useSendMapShare({projectId});

  const selectableDevices = getSelectableDevicesForMapShare({
    peers: availablePeers,
    syncState,
  });

  return (
    <ScrollView
      style={styles.container}
      testID="PROJECT.select-map-share-device-scrn">
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <WifiIcon style={{marginRight: 10}} width={30} height={30} />
        <BodyText>{ssid}</BodyText>
      </View>
      <HeaderText variant="header6" style={{marginTop: 10}}>
        {t(m.notSeeingDevice)}
      </HeaderText>
      <BodyText style={{marginLeft: 10}}>{`\u2022 ${t(m.sameWifi)}`}</BodyText>
      <BodyText
        style={{marginLeft: 10}}>{`\u2022 ${t(m.sameVersion)}`}</BodyText>
      <BodyText
        style={{marginLeft: 10}}>{`\u2022 ${t(m.sameProject)}`}</BodyText>
      <View style={{marginTop: 20}} />

      <View style={styles.deviceListContainer}>
        {selectableDevices.map(device => {
          const {deviceId, status, name, deviceType} = device;

          let isDisconnected: boolean;
          switch (status) {
            case undefined:
            case 'connected':
              isDisconnected = false;
              break;
            case 'disconnected':
              isDisconnected = true;
              break;
            default:
              throw new ExhaustivenessError(status);
          }

          const handlePress = async () => {
            try {
              const mapShare = await sendMapShare({
                projectId,
                receiverDeviceId: deviceId,
                mapId: 'custom',
              });
              navigation.navigate('WaitingForMapAccept', {
                shareId: mapShare.shareId,
              });
            } catch (err) {
              Sentry.captureException(err);
              navigation.navigate('ErrorBottomSheet', {
                error: toError(err, 'Failed to send map share'),
              });
            }
          };

          return (
            <TouchableOpacity
              key={deviceId}
              disabled={isDisconnected}
              onPress={handlePress}>
              <View style={styles.deviceCard}>
                <DeviceNameWithIcon
                  style={{flexShrink: 1}}
                  name={name || ''}
                  deviceConnectionStatus={status}
                  deviceType={deviceType}
                  deviceId={deviceId}
                  iconSize={75}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

SelectMapShareDevice.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  deviceListContainer: {
    gap: 10,
  },
  deviceCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
    justifyContent: 'space-between',
  },
});
