import * as React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {IconButton} from '../../sharedComponents/IconButton';
import {SettingsIcon} from '../../sharedComponents/icons';
import {
  useAllProjects,
  useGetRemoteArchives,
  useProjectSettings,
} from '../../hooks/server/projects';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {CreateOrJoinProjectDisplay} from './CreateOrJoinProjectDisplay';
import {HeaderTitle} from './HeaderTitle';
import {NoWifiDisplay} from './NoWifiDisplay';
import {openWiFiSettings} from '../../lib/linking';
import {ProjectSyncDisplay} from './ProjectSyncDisplay';
import {Loading} from '../../sharedComponents/Loading';
import {useSyncState} from '../../hooks/useSyncState';
import {useNetInfo} from '@react-native-community/netinfo';

export function createNavigationOptions() {
  return ({
    navigation,
  }: NativeRootNavigationProps<'Sync'>): NativeStackNavigationOptions => {
    return {
      headerTitleAlign: 'center',
      headerTitle: () => <HeaderTitle />,
      headerRight: () => (
        <IconButton
          onPress={() => {
            navigation.navigate('ProjectSettings');
          }}>
          <SettingsIcon />
        </IconButton>
      ),
    };
  };
}

export const SyncScreen = ({navigation}: NativeRootNavigationProps<'Sync'>) => {
  const wifiStatus = useLocalDiscoveryState(state => state.wifiStatus);

  const {data: remoteArchive, isPending: remoteArchiveLoading} =
    useGetRemoteArchives();

  const hasRemoteArchive = remoteArchive && remoteArchive.length > 0;

  const hasInternetAccess = useNetInfo().isConnected;

  // TODO: Handle error case
  const {isLoading, data} = useAllProjects();
  const syncState = useSyncState();
  const projectSettingsQuery = useProjectSettings();

  if (
    isLoading ||
    !syncState ||
    !projectSettingsQuery.data ||
    remoteArchiveLoading
  ) {
    return <Loading />;
  }

  // TODO: Replace with proper check of being a part of a shared project
  if (data && data.length === 1) {
    return (
      <CreateOrJoinProjectDisplay
        onCreateOrJoinProject={() => navigation.navigate('CreateOrJoinProject')}
      />
    );
  }

  const shouldShowNoWifiDisplay = () => {
    // Case 1: No remote archive, sync is only possible on WiFi
    if (!hasRemoteArchive && wifiStatus === 'off') {
      return true;
    }
    // Case 2: Remote archive exists, but no general internet connection.
    // If a user has a remote archive they can sync on NON-wifi internet connections
    if (hasRemoteArchive && !hasInternetAccess) {
      return true;
    }
    return false;
  };

  if (shouldShowNoWifiDisplay()) {
    return (
      <NoWifiDisplay
        onOpenSettings={() => {
          openWiFiSettings().catch(err => {
            // Should not throw but in case it does, no-op
            console.warn(err);
          });
        }}
      />
    );
  }

  return (
    <ProjectSyncDisplay
      syncState={syncState}
      projectName={projectSettingsQuery.data.name}
    />
  );
};
