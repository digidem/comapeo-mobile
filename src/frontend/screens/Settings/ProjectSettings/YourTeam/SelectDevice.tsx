import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';

import {useProjectMembers} from '../../../../hooks/server/projects';
import {useLocalDiscoveryState} from '../../../../hooks/useLocalDiscoveryState';
import {useLocalPeers} from '../../../../hooks/useLocalPeers';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';
import WifiIcon from '../../../../images/WifiIcon.svg';
import {DeviceCard} from '../../../../sharedComponents/DeviceCard';
import {Loading} from '../../../../sharedComponents/Loading';
import {Text} from '../../../../sharedComponents/Text';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';

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

export const SelectDevice: NativeNavigationComponent<'SelectDevice'> = () => {
  const ssid = useLocalDiscoveryState(state => state.ssid);
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView style={styles.container} testID="PROJECT.invite-device-scrn">
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <WifiIcon style={{marginRight: 10}} width={30} height={30} />
        <Text>{ssid}</Text>
      </View>
      <Text style={{marginTop: 10}}>{t(m.notSeeingDevice)}</Text>
      <Text style={{marginLeft: 10}}>{`\u2022 ${t(m.sameWifi)}`}</Text>
      <Text style={{marginLeft: 10}}>{`\u2022 ${t(m.sameVersion)}`}</Text>
      {/* Divider */}
      <View style={{marginTop: 20}} />

      <InvitableDeviceList />
    </ScrollView>
  );
};

function InvitableDeviceList() {
  const navigation = useNavigationFromRoot();
  const devices = usePeersConnectedDuringSession();
  const projectMembersQuery = useProjectMembers();

  if (projectMembersQuery.status === 'pending') {
    return <Loading />;
  }

  if (projectMembersQuery.status === 'error') {
    // TODO: Provide more useful UI?
    return null;
  }

  const memberDeviceIds = projectMembersQuery.data.map(
    member => member.deviceId,
  );

  const invitableDevices = devices.filter(device => {
    return !memberDeviceIds.includes(device.deviceId);
  });

  return (
    <View style={styles.deviceListContainer}>
      {invitableDevices.map(device => {
        const {deviceId, status, name} = device;

        // TODO: Use `device.deviceType`
        const deviceType = 'mobile';

        // TODO: Update DeviceCard component to better handle potentially undefined fields, deviceType enum
        return (
          <DeviceCard
            key={deviceId}
            name={name || ''}
            deviceConnectionStatus={status}
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
    </View>
  );
}

SelectDevice.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  deviceListContainer: {
    gap: 10,
  },
});

/**
 * Applies specialized, context-specific behavior on top of `useLocalPeers()` in the following ways:
 *
 * - Resets to only connected peers when consuming component remounts
 * - Updates when either:
 *   1. A peer that hasn't been discovered during the session (i.e. lifetime of consuming component) appears
 *   2. A peer that has been discovered during the session has an updated state
 */
function usePeersConnectedDuringSession() {
  const peers = useLocalPeers();
  const [result, setResult] = React.useState<Array<(typeof peers)[number]>>(
    () => {
      return peers.filter(p => p.status === 'connected');
    },
  );

  React.useEffect(() => {
    setResult(prev => {
      const next = [];

      for (const p of peers) {
        const existing = prev.find(({deviceId}) => deviceId === p.deviceId);

        // Use the most recent information for any peer discovered during lifetime of session
        if (existing) {
          next.push(p);
        }
        // only add newly discovered peers if they're connected
        else if (!existing && p.status === 'connected') {
          next.push(p);
        }
      }

      return next;
    });
  }, [peers, setResult]);

  return result;
}
