import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';

import {useManyMembers} from '@comapeo/core-react';
import type {MemberApi} from '@comapeo/core';
import {type ComapeoCoreClientApi} from '@comapeo/ipc';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import WifiIcon from '../../images/WifiIcon.svg';
import {DeviceNameWithIcon} from '../../sharedComponents/DeviceNameWithIcon';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {LIGHT_GREY} from '../../lib/styles';
import {ExhaustivenessError} from '../../lib/ExhaustivenessError';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../../sharedTypes';
import {useInitiallyConnectedPeers} from './useInitiallyConnectedPeers';

type PublicPeerInfo = Awaited<
  ReturnType<ComapeoCoreClientApi['listLocalPeers']>
>[number];

export function getSelectableDevicesForInvite({
  peers,
  projectMembers,
}: {
  peers: PublicPeerInfo[];
  projectMembers: MemberApi.MemberInfo[];
}): PublicPeerInfo[] {
  return peers.filter(device => {
    const existingMember = projectMembers.some(
      member =>
        member.deviceId === device.deviceId &&
        (member.role.roleId === COORDINATOR_ROLE_ID ||
          member.role.roleId === CREATOR_ROLE_ID ||
          member.role.roleId === MEMBER_ROLE_ID),
    );

    return !existingMember;
  });
}

const m = defineMessages({
  title: {
    id: '$1screen.Settings.ProjectSettings.YourTeam.SelectDevice.title',
    defaultMessage: 'Select Device to Invite',
  },
  notSeeingDevice: {
    id: '$1screen.Settings.ProjectSettings.YourTeam.SelectDevice.notSeeingDevice',
    defaultMessage: 'Not seeing a Device?',
  },
  sameWifi: {
    id: '$1screen.Settings.ProjectSettings.YourTeam.SelectDevice.sameWifi',
    defaultMessage: 'Make sure both devices are on the same Wi-Fi network ',
  },
  sameVersion: {
    id: '$1screen.Settings.ProjectSettings.YourTeam.SelectDevice.sameVersion',
    defaultMessage: 'Make sure both devices are on the same version of CoMapeo',
  },
});

export const SelectInviteDevice = ({
  navigation,
}: NativeRootNavigationProps<'SelectDevice'>) => {
  const ssid = useLocalDiscoveryState(state => state.ssid);
  const {formatMessage: t} = useIntl();

  const availablePeers = useInitiallyConnectedPeers();
  const {projectId} = useActiveProject();
  // includeLeft: false is explicit here to get only active members.
  const projectMembersQuery = useManyMembers({projectId, includeLeft: false});

  const selectableDevices = getSelectableDevicesForInvite({
    peers: availablePeers,
    projectMembers: projectMembersQuery.data,
  });

  return (
    <ScrollView
      style={styles.container}
      testID="PROJECT.select-invite-device-scrn">
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

          const handlePress = () => {
            navigation.navigate('SelectInviteeRole', {
              name: name || '',
              deviceId: deviceId,
              deviceType: deviceType,
            });
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

SelectInviteDevice.navTitle = m.title;

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
