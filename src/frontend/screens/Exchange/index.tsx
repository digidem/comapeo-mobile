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

const ExchangeLoader = () => <LoaderCard />;
const PeersLoader = () => <LoaderCard />;
const LoaderCard = () => (
  <View
    style={{height: 120, margin: 20, borderRadius: 12, backgroundColor: '#eee'}}
  />
);

export const SyncScreen = ({navigation}: NativeRootNavigationProps<'Sync'>) => {
  const {projectId} = useActiveProject();
  const wifiStatus = useLocalDiscoveryState(s => s.wifiStatus);
  const hasInternetAccess = !!useNetInfo().isConnected;

  return (
    <React.Suspense fallback={<ExchangeLoader />}>
      <SoloOrExchangeChecker
        projectId={projectId}
        wifiStatus={wifiStatus}
        hasInternetAccess={hasInternetAccess}
        onGoBack={() => navigation.goBack()}
      />
    </React.Suspense>
  );
};

SyncScreen.navTitle = m.exchangeTitle;

function SoloOrExchangeChecker({
  projectId,
  wifiStatus,
  hasInternetAccess,
  onGoBack,
}: {
  projectId: string;
  wifiStatus: 'unknown' | 'on' | 'off';
  hasInternetAccess: boolean;
  onGoBack: () => void;
}) {
  const projectSettings = useProjectSettings();

  if (projectSettings.data?.name === undefined) {
    return <ExchangeSoloScreen onGoBack={onGoBack} />;
  }
  return (
    <ExchangeWifiSwitch
      projectId={projectId}
      wifiStatus={wifiStatus}
      hasInternetAccess={hasInternetAccess}
      onGoBack={onGoBack}
    />
  );
}

function ExchangeWifiSwitch({
  projectId,
  wifiStatus,
  hasInternetAccess,
  onGoBack,
}: {
  projectId: string;
  wifiStatus: 'unknown' | 'on' | 'off';
  hasInternetAccess: boolean;
  onGoBack: () => void;
}) {
  const hasRemoteArchive = !!useActiveArchiveServer({projectId});

  const noWifi =
    (!hasRemoteArchive && wifiStatus === 'off') ||
    (hasRemoteArchive && !hasInternetAccess);

  if (noWifi) return <NoWifiDisplay onGoBack={onGoBack} />;
  return <PeersSection projectId={projectId} />;
}

function PeersSection({projectId}: {projectId: string}) {
  const syncState = useSyncState({projectId});

  if (!syncState) return <PeersLoader />;
  return <ExchangeScreenContent syncState={syncState} />;
}
