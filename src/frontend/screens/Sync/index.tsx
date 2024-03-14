import * as React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {NativeRootNavigationProps} from '../../sharedTypes';
import {IconButton} from '../../sharedComponents/IconButton';
import {SettingsIcon} from '../../sharedComponents/icons';
import {useAllProjects} from '../../hooks/server/projects';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {CreateOrJoinProjectDisplay} from './CreateOrJoinProjectDisplay';
import {HeaderTitle} from './HeaderTitle';
import {NoWifiDisplay} from './NoWifiDisplay';
import {openWiFiSettings} from '../../lib/linking';
import {ProjectSyncDisplay} from './ProjectSyncDisplay';
import {Loading} from '../../sharedComponents/Loading';

export function createNavigationOptions(): () => NativeStackNavigationOptions {
  return () => {
    return {
      headerTitleAlign: 'center',
      headerTitle: () => <HeaderTitle />,
      headerRight: () => (
        <IconButton onPress={() => {}}>
          <SettingsIcon />
        </IconButton>
      ),
    };
  };
}

export const SyncScreen = ({navigation}: NativeRootNavigationProps<'Sync'>) => {
  // TODO: Is this the right field to use?
  const wifiStatus = useLocalDiscoveryState(state => state.wifiStatus);

  // TODO: Handle error case
  const {isLoading, data} = useAllProjects();

  if (isLoading) {
    return <Loading />;
  }

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

  return <ProjectSyncDisplay />;
};
