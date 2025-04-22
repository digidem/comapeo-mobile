import * as React from 'react';
import {useSyncState} from '@comapeo/core-react';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  useGetRemoteArchives,
  useProjectSettings,
} from '../../hooks/server/projects';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {ExchangeSoloScreen} from './ExchangeSoloScreen';
import {NoWifiDisplay} from './NoWifiDisplay';
import {openWiFiSettings} from '../../lib/linking';
import {ExchangeScreenContent} from './ExchangeScreenContent';
import {Loading} from '../../sharedComponents/Loading';
import {useNetInfo} from '@react-native-community/netinfo';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  exchangeTitle: {
    id: 'screens.Sync.headerTitle',
    defaultMessage: 'Exchange',
  },
});

export const SyncScreen = ({navigation}: NativeRootNavigationProps<'Sync'>) => {
  const wifiStatus = useLocalDiscoveryState(state => state.wifiStatus);

  const {data: remoteArchive, isRefetching: remoteArchiveLoading} =
    useGetRemoteArchives();

  const hasRemoteArchive = remoteArchive && remoteArchive.length > 0;

  const hasInternetAccess = useNetInfo().isConnected;

  const {projectId} = useActiveProject();
  const syncState = useSyncState({projectId});
  const projectSettingsQuery = useProjectSettings();

  if (!syncState || remoteArchiveLoading) {
    return <Loading />;
  }

  if (projectSettingsQuery.data?.name === undefined) {
    return <ExchangeSoloScreen onGoBack={() => navigation.goBack()} />;
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

  return <ExchangeScreenContent syncState={syncState} />;
};

SyncScreen.navTitle = m.exchangeTitle;
