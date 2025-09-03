import * as React from 'react';
import {
  useDataSyncProgress,
  useIsArchiveDevice,
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
  BLUE_GREY,
  COMAPEO_BLUE,
  DARK_GREEN,
  DARK_ORANGE,
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
import {DoneIcon, StopIcon, SyncIcon} from '../../sharedComponents/icons';
import {Circle} from '../../sharedComponents/icons/Circle';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {ROOT_QUERY_KEY} from '../../constants';
import {useActiveArchiveServer} from '../../hooks/server/projects';
import {Button} from '../../sharedComponents/Button';
import {ExchangeSettingsCard} from './ExchangeSettingsCard';
import {WifiCard} from './WifiCard';
import {DevicesAvailableHeader} from './DevicesAvailableHeader';
import {invalidateStorageReading} from '../../hooks/useStorageReadingQuery';

const m = defineMessages({
  devicesFound: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesFound',
    defaultMessage: 'Devices found.',
  },
  noDevicesFound: {
    id: 'screens.Sync.ProjectSyncDisplay.noDevicesFound',
    defaultMessage: 'No devices found.',
  },
  waitingForDevices: {
    id: 'screens.Sync.ProjectSyncDisplay.waitingForDevices',
    defaultMessage: 'Waiting for devices...',
  },
  syncingWithDevices: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingWithDevices',
    defaultMessage: 'Exchanging...',
  },
  syncingCompleteButWaitingForOthers: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingCompleteButWaitingForOthers',
    defaultMessage: 'Complete! Waiting for other devices to join',
  },
  syncingFullyComplete: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingFullyComplete',
    defaultMessage: 'Complete!',
  },
  allDataSynced: {
    id: 'screens.Sync.ProjectSyncDisplay.allDataSynced',
    defaultMessage: 'Up to date!',
  },
  progressSyncPercentage: {
    id: 'screens.Sync.ProjectSyncDisplay.syncProgress',
    defaultMessage: '{value}%',
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
  close: {
    id: 'screens.Sync.ProjectSyncDisplay.close',
    defaultMessage: 'Close',
  },
  wifiCardPlaceholder: {
    id: 'screens.Sync.ProjectSyncDisplay.wifiCardPlaceholder',
    defaultMessage: '{ssid}',
  },
  noWifi: {
    id: 'screens.Sync.ProjectSyncDisplay.noWifi',
    defaultMessage: 'No Wi-Fi.',
  },
  allCaughtUp: {
    id: 'screens.Sync.ProjectSyncDisplay.allCaughtUp',
    defaultMessage: "You're all caught up!",
  },
  exchangeEverythingTitle: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangeEverythingTitle',
    defaultMessage: 'Exchange everything.',
  },
  exchangeEverythingMediaDescription: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangeEverythingMediaDescription',
    defaultMessage: 'Full size photos and audio.',
  },
  exchangeEverythingStorageDescription: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangeEverythingStorageDescription',
    defaultMessage: 'Uses more storage.',
  },
  exchangePreviewsOnlyTitle: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangePreviewsOnlyTitle',
    defaultMessage: 'Exchange previews only.',
  },
  exchangePreviewsOnlyMediaDescription: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangePreviewsOnlyMediaDescription',
    defaultMessage: 'Reduced smaller size photos.',
  },
  exchangePreviewsOnlyAudioDescription: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangePreviewsOnlyAudioDescription',
    defaultMessage: 'No audio included.',
  },
  exchangeAction: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangeAction',
    defaultMessage: 'Change Settings',
  },
});

export const ExchangeScreenContent = ({syncState}: {syncState: SyncState}) => {
  const {formatMessage: t} = useIntl();
  const queryClient = useQueryClient();
  const navigation = useNavigationFromRoot();
  const {projectApi, projectId} = useActiveProject();
  const progress = useDataSyncProgress({projectId});
  const startSync = useStartSync({projectId});
  const {data: isArchive} = useIsArchiveDevice();

  const currentMediaSetting = isArchive ? 'everything' : 'previews';

  const ssid = useLocalDiscoveryState(state => state.ssid);

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
        invalidateStorageReading(queryClient);
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

  if (syncStage.name === 'complete-full' && !syncState.data.isSyncEnabled) {
    dockContent = (
      <SecondaryButton fullSize text={t(m.close)} onPress={navigation.goBack} />
    );

    syncInfoContent = (
      <>
        <HeaderText variant="header2" style={styles.exchangeInfoText}>
          {t(m.allDataSynced)}
        </HeaderText>
      </>
    );
  } else {
    switch (syncStage.name) {
      case 'idle': {
        dockContent =
          syncStage.connectedPeersCount > 0 ? (
            <PrimaryButton
              fullSize
              text={t(m.start)}
              renderIcon={({size}) => <SyncIcon size={size} />}
              onPress={() => {
                // TODO: Catch/surface error
                startSync.mutate(undefined);
              }}
            />
          ) : (
            <SecondaryButton
              fullSize={true}
              text={t(m.close)}
              onPress={() => navigation.goBack()}
            />
          );

        syncInfoContent = (
          <>
            <HeaderText variant="header2" style={styles.exchangeInfoText}>
              {syncStage.connectedPeersCount > 0
                ? t(m.devicesFound)
                : t(m.noDevicesFound)}
            </HeaderText>
          </>
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
            renderIcon={({size, color}) => (
              <StopIcon size={size} color={color} />
            )}
          />
        );

        syncInfoContent = (
          <>
            <HeaderText variant="header2" style={styles.exchangeInfoText}>
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
            renderIcon={({size, color}) => (
              <StopIcon size={size} color={color} />
            )}
          />
        );

        syncInfoContent = (
          <>
            <HeaderText variant="header2" style={styles.exchangeInfoText}>
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
            renderIcon={({size, color}) => (
              <StopIcon size={size} color={color} />
            )}
          />
        );

        syncInfoContent = (
          <>
            <HeaderText variant="header2" style={styles.exchangeInfoText}>
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
            renderIcon={({size, color}) => (
              <StopIcon size={size} color={color} />
            )}
          />
        ) : (
          <Button variant="text" disabled onPress={() => {}}>
            <HeaderText variant="header5">{t(m.allCaughtUp)}</HeaderText>
          </Button>
        );

        syncInfoContent = (
          <>
            <HeaderText variant="header2" style={styles.exchangeInfoText}>
              {t(m.syncingFullyComplete)}
            </HeaderText>
            <SyncProgress stage={syncStage} />
          </>
        );

        break;
      }
      default:
        throw new ExhaustivenessError(syncStage);
    }
  }

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={dockContent}>
      <WifiCard ssid={ssid} />
      <View style={styles.contentWrapper}>
        <View style={styles.projectInfoContainer}>
          <DevicesAvailableHeader
            iconColor={
              syncStage.connectedPeersCount > 0 ? DARK_ORANGE : BLUE_GREY
            }
            overlayType={currentMediaSetting === 'everything' ? 'star' : 'leaf'}
            showOverlay={syncStage.connectedPeersCount > 0}
          />
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
        <View style={{flexGrow: 1, justifyContent: 'space-between'}}>
          {syncInfoContent}
          <ExchangeSettingsCard
            title={t(
              currentMediaSetting === 'everything'
                ? m.exchangeEverythingTitle
                : m.exchangePreviewsOnlyTitle,
            )}
            mediaDescription={t(
              currentMediaSetting === 'everything'
                ? m.exchangeEverythingMediaDescription
                : m.exchangePreviewsOnlyMediaDescription,
            )}
            storageDescription={t(
              currentMediaSetting === 'everything'
                ? m.exchangeEverythingStorageDescription
                : m.exchangePreviewsOnlyAudioDescription,
            )}
            showChangeSettingsLink={
              (!syncState.data.isSyncEnabled &&
                syncStage.name === 'complete-full') ||
              syncStage.name === 'idle'
            }
            onPressChangeSettings={() =>
              navigation.navigate('ExchangeSettingsBottomSheet')
            }
          />
        </View>
      </View>
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

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabelRow}>
        {stage.name === 'complete-full' ? (
          <DoneIcon color={DARK_GREEN} size={30} />
        ) : stage.name !== 'waiting' ? (
          <SyncIcon color={COMAPEO_BLUE} size={20} />
        ) : null}
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

      {
        <BodyText style={styles.progressPercent}>
          {t(m.progressSyncPercentage, {
            value:
              stage.name === 'waiting' ? 0 : Math.round(stage.progress * 100),
          })}
        </BodyText>
      }
    </View>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    gap: 10,
    flexGrow: 1,
  },
  projectInfoContainer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 35,
    paddingBottom: 40,
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
  },
  progressContainer: {
    gap: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  progressPercent: {
    color: MEDIUM_GREY,
    textAlign: 'right',
    marginTop: 4,
  },
  contentWrapper: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});
