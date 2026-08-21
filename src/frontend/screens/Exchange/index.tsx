import * as React from 'react';
import {useSyncState} from '@comapeo/core-react';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  useActiveArchiveServer,
  useProjectSettings,
} from '../../hooks/server/projects';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {ExchangeSoloScreen} from './ExchangeSoloScreen';
import {NoWifiDisplay} from './NoWifiDisplay';
import {ExchangeScreenContent} from './ExchangeScreenContent';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
import {useNetInfo} from '@react-native-community/netinfo';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  exchangeTitle: {
    id: '$1screens.Sync.headerTitle',
    defaultMessage: 'Exchange',
  },
});

export const SyncScreen = ({navigation}: NativeRootNavigationProps<'Sync'>) => {
  const wifiStatus = useLocalDiscoveryState(state => state.wifiStatus);

  const hasInternetAccess = useNetInfo().isConnected;

  const {projectId} = useActiveProject();
  const syncState = useSyncState({projectId});
  const projectSettingsQuery = useProjectSettings();

  const hasRemoteArchive = !!useActiveArchiveServer({projectId});

  if (!syncState) {
    return <FullScreenCenteredLoader />;
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
    return <NoWifiDisplay onGoBack={() => navigation.goBack()} />;
  }

  return <ExchangeScreenContent syncState={syncState} />;
};

SyncScreen.navTitle = m.exchangeTitle;
