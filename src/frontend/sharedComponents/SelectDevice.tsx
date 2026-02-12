import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import * as Sentry from '@sentry/react-native';

import {
  useManyMembers,
  useSendMapShare,
  type SentMapShareState,
} from '@comapeo/core-react';
import {type MemberInfo} from '@comapeo/core/dist/member-api';
import {type MapeoClientApi} from '@comapeo/ipc';
import {useLocalDiscoveryState} from '../hooks/useLocalDiscoveryState';
import {useLocalPeers} from '../hooks/useLocalPeers';
import WifiIcon from '../images/WifiIcon.svg';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';
import {BodyText} from './Text/BodyText';
import {HeaderText} from './Text/HeaderText';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {LIGHT_GREY} from '../lib/styles';
import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import {type NativeRootNavigationProps} from '../sharedTypes/navigation';
import {
  BLOCKED_ROLE_ID,
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  LEFT_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';

type PublicPeerInfo = Awaited<
  ReturnType<MapeoClientApi['listLocalPeers']>
>[number];

const m = defineMessages({
  title: {
    id: 'screen.Settings.ProjectSettings.YourTeam.SelectDevice.title',
    defaultMessage: 'Select Device to Invite',
  },
  titleMapShare: {
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
});

type SelectionMode = 'invites' | 'shareMap';

export const SelectDevice = ({
  navigation,
  route,
}: NativeRootNavigationProps<'SelectDevice' | 'SelectMapShareDevice'>) => {
  const ssid = useLocalDiscoveryState(state => state.ssid);
  const {formatMessage: t} = useIntl();

  const availablePeers = useInitiallyConnectedPeers();
  const {projectId} = useActiveProject();
  const projectMembersQuery = useManyMembers({projectId});
  const {mutate: sendMapShare} = useSendMapShare({projectId});

  const selectionMode: SelectionMode =
    route.name === 'SelectMapShareDevice' ? 'shareMap' : 'invites';

  const selectableDevices = getSelectableDevices({
    peers: availablePeers,
    projectMembers: projectMembersQuery.data,
    selectionMode,
  });

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
            if (selectionMode === 'shareMap') {
              sendMapShare(
                {projectId, receiverDeviceId: deviceId, mapId: 'custom'},
                {
                  onSuccess: result => {
                    Promise.resolve(result).then(mapShare => {
                      navigation.navigate('WaitingForMapAccept', {
                        shareId: mapShare.shareId,
                      });
                    });
                  },
                  onError: (err: Error) => {
                    Sentry.captureException(err);
                    navigation.navigate('ErrorBottomSheet');
                  },
                },
              );
            } else {
              navigation.navigate('SelectInviteeRole', {
                name: name || '',
                deviceId: deviceId,
                deviceType: deviceType,
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

SelectDevice.navTitle = m.title;
SelectDevice.navTitleMapShare = m.titleMapShare;

type GetSelectableDevicesParams = {
  peers: PublicPeerInfo[];
  projectMembers: MemberInfo[];
  selectionMode: SelectionMode;
};

export function getSelectableDevices({
  peers,
  projectMembers,
  selectionMode,
}: GetSelectableDevicesParams): PublicPeerInfo[] {
  if (selectionMode === 'shareMap') {
    return peers.filter(device => {
      const isActiveProjectMember = projectMembers.some(
        member =>
          member.deviceId === device.deviceId &&
          member.role.roleId !== BLOCKED_ROLE_ID &&
          member.role.roleId !== LEFT_ROLE_ID,
      );
      return isActiveProjectMember;
    });
  }

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
