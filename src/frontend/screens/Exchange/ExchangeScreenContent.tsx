import * as React from 'react';
import {
  useDataSyncProgress,
  useStartSync,
  type SyncState,
} from '@comapeo/core-react';
import {useFocusEffect} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Bar as ProgressBar} from 'react-native-progress';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useLocalDiscoveryState} from '../../hooks/useLocalDiscoveryState';
import {ExhaustivenessError} from '../../lib/ExhaustivenessError';
import {
  BLACK,
  COMAPEO_BLUE,
  DARK_GREEN,
  DARK_GREY,
  LIGHT_GREY,
  MEDIUM_GREY,
  WHITE,
} from '../../lib/styles';
import {
  deriveSyncStage,
  getConnectedPeersCount,
  getSyncingPeersCount,
  type SyncStage,
} from '../../lib/sync';
import {
  DoneIcon,
  StopIcon,
  SyncIcon,
  WifiIcon,
  WifiOffIcon,
} from '../../sharedComponents/icons';
import {Circle} from '../../sharedComponents/icons/Circle';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {ROOT_QUERY_KEY} from '../../constants';
import {useActiveArchiveServer} from '../../hooks/server/projects';
import {Button} from '../../sharedComponents/Button';

const m = defineMessages({
  devicesFound: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesFound',
    defaultMessage: 'Devices found',
  },
  connectedTo: {
    id: 'screens.Sync.ProjectSyncDisplay.connectedTo',
    defaultMessage: 'Connected to',
  },

  noDevicesAvailableToSync: {
    id: 'screens.Sync.ProjectSyncDisplay.noDevicesAvailableToSync',
    defaultMessage: 'No devices available to sync',
  },
  devicesAvailableToSync: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesAvailableToSync',
    defaultMessage: 'Devices available',
  },
  waitingForDevices: {
    id: 'screens.Sync.ProjectSyncDisplay.waitingForDevices',
    defaultMessage: 'Waiting for devices',
  },
  syncingWithDevices: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingWithDevices',
    defaultMessage: 'You are exchanging with your team',
  },
  syncingCompleteButWaitingForOthers: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingCompleteButWaitingForOthers',
    defaultMessage: 'Complete! Waiting for other devices to join',
  },
  syncingFullyComplete: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingFullyComplete',
    defaultMessage: "Complete! You're up to date",
  },

  allDataSynced: {
    id: 'screens.Sync.ProjectSyncDisplay.allDataSynced',
    defaultMessage: 'All data exchanged',
  },
  progressLabelWaiting: {
    id: 'screens.Sync.ProjectSyncDisplay.progressLabelWaiting',
    defaultMessage: 'Waiting…',
  },
  progressLabelSyncing: {
    id: 'screens.Sync.ProjectSyncDisplay.progressLabelSyncing',
    defaultMessage: 'Syncing…',
  },
  progressLabelWithDeviceCount: {
    id: 'screens.Sync.ProjectSyncDisplay.progressLabelWithDeviceCount',
    defaultMessage: 'Waiting for other devices',
  },
  progressSyncPercentage: {
    id: 'screens.Sync.ProjectSyncDisplay.syncProgress',
    defaultMessage: '{value}%',
  },
  readyToExchange: {
    id: 'screens.Sync.ProjectSyncDisplay.readyToExchange',
    defaultMessage: 'Ready to exchange',
  },
  remoteArchiveConnected: {
    id: 'screens.Sync.remoteArchiveConnected',
    defaultMessage: 'Remote Archive connected',
  },

  start: {
    id: 'screens.Sync.ProjectSyncDisplay.start',
    defaultMessage: 'Start',
  },
  stop: {
    id: 'screens.Sync.ProjectSyncDisplay.stop',
    defaultMessage: 'Stop',
  },
  wifiCardPlaceholder: {
    id: 'screens.Sync.ProjectSyncDisplay.wifiCardPlaceholder',
    defaultMessage: '{ssid}',
  },
  noWifi: {
    id: 'screens.Sync.ProjectSyncDisplay.noWifi',
    defaultMessage: 'No Wi-Fi',
  },
  allCaughtUp: {
    id: 'screens.Sync.ProjectSyncDisplay.allCaughtUp',
    defaultMessage: "You're all caught up!",
  },
});

export const ExchangeScreenContent = ({syncState}: {syncState: SyncState}) => {
  const {formatMessage: t} = useIntl();
  const queryClient = useQueryClient();
  const navigation = useNavigationFromRoot();
  const {projectApi, projectId} = useActiveProject();
  const progress = useDataSyncProgress({projectId});
  const startSync = useStartSync({projectId});

  const ssid = useLocalDiscoveryState(state => state.ssid);

  const WifiIconComponent = ssid ? WifiIcon : WifiOffIcon;

  const connectedPeersCount = getConnectedPeersCount(
    syncState.remoteDeviceSyncState,
  );

  const remoteArchiveConnected = !!useActiveArchiveServer({projectId});

  const syncingPeersCount = getSyncingPeersCount(
    syncState.remoteDeviceSyncState,
  );

  const syncStage = deriveSyncStage({
    progress,
    connectedPeersCount,
    syncingPeersCount,
    dataSyncEnabled: syncState.data.isSyncEnabled,
  });

  useFocusEffect(
    React.useCallback(() => {
      // Unset sync autostop when screen mounts
      projectApi.$sync.setAutostopDataSyncTimeout(null);
      // Connects to Servers
      projectApi.$sync.connectServers();
      return () => {
        projectApi.$sync.disconnectServers();
      };
    }, [projectApi]),
  );

  const shouldAutostopSyncWhenLeavingScreen =
    syncState.data.isSyncEnabled && syncStage.name === 'complete-full';

  // Set up listener for autostopping sync (if applicable) and invalidating queries when navigating away from screen
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        if (shouldAutostopSyncWhenLeavingScreen) {
          projectApi.$sync.setAutostopDataSyncTimeout(30_000);
        }
        queryClient.invalidateQueries({
          queryKey: [ROOT_QUERY_KEY, 'projects', projectId],
        });
      });

      return () => {
        unsubscribe();
      };
    }, [
      navigation,
      projectApi,
      queryClient,
      projectId,
      shouldAutostopSyncWhenLeavingScreen,
    ]),
  );

  let dockContent: React.ReactNode;
  let syncInfoContent: React.ReactNode;

  switch (syncStage.name) {
    case 'idle': {
      dockContent = (
        <PrimaryButton
          fullSize
          text={t(m.start)}
          renderIcon={({size}) => <SyncIcon size={size} />}
          onPress={() => {
            // TODO: Catch/surface error
            startSync.mutate(undefined);
          }}
        />
      );

      syncInfoContent = (
        <HeaderText variant="header1" style={styles.exchangeInfoText}>
          {syncStage.connectedPeersCount > 0
            ? t(m.readyToExchange)
            : t(m.noDevicesAvailableToSync)}
        </HeaderText>
      );
      break;
    }
    case 'waiting': {
      dockContent = (
        <SecondaryButton
          fullSize={true}
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}
          text={t(m.stop)}
          renderIcon={({size, color}) => <StopIcon size={size} color={color} />}
        />
      );

      syncInfoContent = (
        <>
          <HeaderText variant="header1" style={styles.exchangeInfoText}>
            {t(m.waitingForDevices)}
          </HeaderText>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    case 'syncing': {
      dockContent = (
        <SecondaryButton
          fullSize={true}
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}
          text={t(m.stop)}
          renderIcon={({size, color}) => <StopIcon size={size} color={color} />}
        />
      );

      syncInfoContent = (
        <>
          <HeaderText variant="header1" style={styles.exchangeInfoText}>
            {syncStage.progress === 0
              ? t(m.waitingForDevices)
              : t(m.syncingWithDevices)}
          </HeaderText>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    case 'complete-partial': {
      dockContent = (
        <SecondaryButton
          fullSize={true}
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}
          text={t(m.stop)}
          renderIcon={({size, color}) => <StopIcon size={size} color={color} />}
        />
      );

      syncInfoContent = (
        <>
          <HeaderText variant="header1" style={styles.exchangeInfoText}>
            {t(m.syncingCompleteButWaitingForOthers)}
          </HeaderText>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    case 'complete-full': {
      dockContent = syncState.data.isSyncEnabled ? (
        <SecondaryButton
          fullSize={true}
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}
          text={t(m.stop)}
          renderIcon={({size, color}) => <StopIcon size={size} color={color} />}
        />
      ) : (
        <Button variant="text" disabled onPress={() => {}}>
          <HeaderText variant="header5">{t(m.allCaughtUp)}</HeaderText>
        </Button>
      );

      syncInfoContent = (
        <>
          <View>
            <HeaderText variant="header1" style={styles.exchangeInfoText}>
              {t(m.syncingFullyComplete)}
            </HeaderText>
            <HeaderText variant="header2" style={{textAlign: 'center'}}>
              {t(m.allDataSynced)}
            </HeaderText>
          </View>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    default: {
      throw new ExhaustivenessError(
        // @ts-expect-error Handled at runtime
        syncState.status,
      );
    }
  }

  const devicesAvailableText = syncStage.connectedPeersCount > 0 && (
    <View style={styles.connectedDevicesInfoContainer}>
      <WifiIcon color={DARK_GREY} size={20} />
      <BodyText style={{color: BLACK}} variant="smallMeta">
        {t(m.devicesFound)}
      </BodyText>
    </View>
  );

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={dockContent}>
      <View style={styles.wifiCard}>
        <Circle color="#000033" radius={14} style={styles.signalIndicator}>
          <WifiIconComponent size={16} color={WHITE} />
        </Circle>
        <BodyText style={styles.wifiCardTextContainer}>
          {ssid ? (
            <>
              {t(m.connectedTo)}{' '}
              <BodyText style={styles.wifiName}>{ssid}</BodyText>
            </>
          ) : (
            <>
              {t(m.wifiCardPlaceholder, {ssid: ''})}
              <BodyText style={styles.wifiName}>{t(m.noWifi)}</BodyText>
            </>
          )}
        </BodyText>
      </View>
      <View style={styles.projectInfoContainer}>
        {devicesAvailableText}
        {remoteArchiveConnected && (
          <View style={styles.remoteInfoContainer}>
            <Circle
              color="#444444"
              radius={7}
              style={{backgroundColor: '#444444', elevation: 0}}
            />
            <BodyText variant="smallMeta" style={styles.remoteArchiveText}>
              {t(m.remoteArchiveConnected)}
            </BodyText>
          </View>
        )}
      </View>
      {syncInfoContent}
    </ScreenContentWithDock>
  );
};

function SyncProgress({
  stage,
}: {
  stage: Extract<
    SyncStage,
    {name: 'syncing' | 'waiting' | 'complete-partial' | 'complete-full'}
  >;
}) {
  const {formatMessage: t} = useIntl();

  let progressLabel: string;

  switch (stage.name) {
    case 'waiting': {
      progressLabel = t(m.progressLabelWaiting);
      break;
    }
    case 'syncing': {
      progressLabel = t(m.progressLabelSyncing);
      break;
    }
    case 'complete-partial': {
      progressLabel = t(m.progressLabelWithDeviceCount);
      break;
    }
    case 'complete-full': {
      progressLabel = '';
      break;
    }
    default: {
      throw new ExhaustivenessError(
        // @ts-expect-error Handled at runtime
        stage.name,
      );
    }
  }

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabelRow}>
        {stage.name === 'complete-full' ? (
          <DoneIcon color={DARK_GREEN} size={20} />
        ) : (
          <SyncIcon color={COMAPEO_BLUE} size={20} />
        )}
        <HeaderText
          variant="header3"
          style={{
            color: stage.name === 'complete-full' ? DARK_GREEN : COMAPEO_BLUE,
          }}>
          {progressLabel}
        </HeaderText>
      </View>
      <ProgressBar
        {...(stage.name === 'waiting'
          ? {indeterminate: true, indeterminateAnimationDuration: 2000}
          : {progress: stage.progress, indeterminate: false})}
        height={10}
        width={null}
        borderRadius={0}
        color={stage.name === 'complete-full' ? DARK_GREEN : COMAPEO_BLUE}
        unfilledColor={LIGHT_GREY}
        borderColor={WHITE}
      />

      {stage.name !== 'waiting' && (
        <BodyText style={styles.progressPercent}>
          {t(m.progressSyncPercentage, {
            value: Math.round(stage.progress * 100),
          })}
        </BodyText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    gap: 10,
  },
  wifiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 10,
    width: '100%',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#CCCCD6',
    borderRadius: 6,
    justifyContent: 'flex-start',
  },
  wifiCardTextContainer: {
    flex: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  wifiName: {
    fontWeight: '500',
  },
  projectInfoContainer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 35,
    paddingBottom: 40,
  },
  connectedDevicesInfoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  remoteInfoContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  remoteArchiveText: {
    textAlign: 'center',
    color: BLACK,
  },
  exchangeInfoText: {
    textAlign: 'center',
    color: BLACK,
  },
  progressContainer: {
    marginTop: 30,
    gap: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    color: MEDIUM_GREY,
    textAlign: 'right',
    marginTop: 4,
  },
  signalIndicator: {
    elevation: 0,
    backgroundColor: '#000033',
  },
});
