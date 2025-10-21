import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';

import {useManyMembers} from '@comapeo/core-react';
import {useLocalDiscoveryState} from '../../../../hooks/useLocalDiscoveryState';
import {useLocalPeers} from '../../../../hooks/useLocalPeers';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';
import WifiIcon from '../../../../images/WifiIcon.svg';
import {DeviceCard} from '../../../../sharedComponents/DeviceCard';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {useActiveProject} from '../../../../contexts/ActiveProjectContext';
import type {DeviceType} from '../../../../sharedTypes';

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
    defaultMessage: 'Make sure both devices are on the same version of CoMapeo',
  },
});

function normalizeDeviceType(
  deviceType: DeviceType | undefined,
): NonNullable<DeviceType> {
  if (
    !deviceType ||
    deviceType === 'UNRECOGNIZED' ||
    deviceType === 'device_type_unspecified'
  ) {
    return 'mobile';
  }
  return deviceType;
}

export const SelectDevice: NativeNavigationComponent<'SelectDevice'> = () => {
  const ssid = useLocalDiscoveryState(state => state.ssid);
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView style={styles.container} testID="PROJECT.invite-device-scrn">
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
      {/* Divider */}
      <View style={{marginTop: 20}} />

      <InvitableDevicesList />
    </ScrollView>
  );
};

function InvitableDevicesList() {
  const navigation = useNavigationFromRoot();
  const devices = useInitiallyConnectedPeers();
  const projectId = useActiveProject();
  const projectMembersQuery = useManyMembers(projectId);

  const invitableDevices = devices.filter(device => {
    const existingMember = projectMembersQuery.data.find(
      member => member.deviceId === device.deviceId,
    );

    if (!existingMember) {
      return true;
    }

    return false;
  });

  return (
    <View style={styles.deviceListContainer}>
      {invitableDevices.map(device => {
        const {deviceId, status, name, deviceType: rawDeviceType} = device;
        const deviceType = normalizeDeviceType(rawDeviceType);

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
 * Applies specialized, context-specific behavior on top of `useLocalPeers()`
 * by only including peers that were *initially* connected from the point of view of the consuming component.
 * If these included peers receive subsequent updates (e.g. disconnecting), they are still returned.
 * This hook only prevents *initially* returning peers that are disconnected.
 */
function useInitiallyConnectedPeers() {
  const peers = useLocalPeers();
  const [relevantDeviceIds, setRelevantDeviceIds] = React.useState<
    Array<string>
  >(() => {
    return peers.filter(p => p.status === 'connected').map(p => p.deviceId);
  });

  React.useEffect(() => {
    setRelevantDeviceIds(prev => {
      const next = [];

      for (const p of peers) {
        const included = prev.includes(p.deviceId);

        if (included) {
          next.push(p.deviceId);
        } else {
          if (p.status === 'connected') {
            next.push(p.deviceId);
          }
        }
      }

      return next;
    });
  }, [peers, setRelevantDeviceIds]);

  return peers.filter(p => relevantDeviceIds.includes(p.deviceId));
}
