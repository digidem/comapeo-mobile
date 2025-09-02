import * as React from 'react';
import {View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSyncState} from '@comapeo/core-react';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {
  useProjectSettings,
  useActiveArchiveServer,
} from '../../hooks/server/projects';

import {ExchangeSoloScreen} from './ExchangeSoloScreen';
import {NoWifiDisplay} from './NoWifiDisplay';
import {ExchangeScreenContent} from './ExchangeScreenContent';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  exchangeTitle: {id: 'screens.Sync.headerTitle', defaultMessage: 'Exchange'},
});

const LoaderCard = () => (
  <View
    style={{height: 120, margin: 20, borderRadius: 12, backgroundColor: '#eee'}}
  />
);

export const SyncScreen = ({navigation}: NativeRootNavigationProps<'Sync'>) => {
  const projectSettings = useProjectSettings();
  if (projectSettings.data?.name === undefined)
    return <ExchangeSoloScreen onGoBack={() => navigation.goBack()} />;
  return (
    <React.Suspense fallback={<LoaderCard />}>
      <ExchangeWifiSwitch onGoBack={() => navigation.goBack()} />
    </React.Suspense>
  );
};
SyncScreen.navTitle = m.exchangeTitle;

function ExchangeWifiSwitch({onGoBack}: {onGoBack: () => void}) {
  const {projectId} = useActiveProject();
  const wifiStatus = useLocalDiscoveryState(s => s.wifiStatus);
  const hasInternetAccess = !!useNetInfo().isConnected;
  const hasRemoteArchive = !!useActiveArchiveServer({projectId});

  const syncState = useSyncState({projectId});

  const noWifi =
    (!hasRemoteArchive && wifiStatus === 'off') ||
    (hasRemoteArchive && !hasInternetAccess);

  if (noWifi) return <NoWifiDisplay onGoBack={onGoBack} />;
  if (!syncState) return <LoaderCard />;

  return <ExchangeScreenContent syncState={syncState} />;
}
