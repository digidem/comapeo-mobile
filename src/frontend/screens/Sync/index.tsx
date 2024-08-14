import * as React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {IconButton} from '../../sharedComponents/IconButton';
import {SettingsIcon} from '../../sharedComponents/icons';
import {useAllProjects, useProjectSettings} from '../../hooks/server/projects';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {CreateOrJoinProjectDisplay} from './CreateOrJoinProjectDisplay';
import {HeaderTitle} from './HeaderTitle';
import {NoWifiDisplay} from './NoWifiDisplay';
import {openWiFiSettings} from '../../lib/linking';
import {
  ProjectSyncDisplay,
  ProjectSyncDisplayAlternative,
} from './ProjectSyncDisplay';
import {Loading} from '../../sharedComponents/Loading';
import {useSyncState} from '../../hooks/useSyncState';

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

  // TODO: Handle error case
  const {isLoading, data} = useAllProjects();
  const syncState = useSyncState();
  const projectSettingsQuery = useProjectSettings();

  if (wifiStatus === 'off') {
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

  // TODO: Replace with proper check of being a part of a shared project
  if (data && data.length === 1) {
    return (
      <CreateOrJoinProjectDisplay
        onCreateOrJoinProject={() => navigation.navigate('CreateOrJoinProject')}
      />
    );
  }

  if (isLoading || !syncState || !projectSettingsQuery.data) {
    return <Loading />;
  }

  return (
    // <ProjectSyncDisplay
    <ProjectSyncDisplayAlternative
      syncState={syncState}
      projectName={projectSettingsQuery.data.name}
    />
  );
};
