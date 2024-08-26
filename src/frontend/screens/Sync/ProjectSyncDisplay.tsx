import * as React from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Bar as ProgressBar} from 'react-native-progress';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {OBSERVATION_KEY} from '../../hooks/server/observations';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  SyncState,
  getConnectedPeersCount,
  getSyncingPeersCount,
  useDataSyncProgress,
} from '../../hooks/useSyncState';
import ObservationsProjectImage from '../../images/ObservationsProject.svg';
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
import {Button} from '../../sharedComponents/Button';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';
import {
  DoneIcon,
  StopIcon,
  SyncIcon,
  WifiIcon,
} from '../../sharedComponents/icons';

type SyncStage =
  | {
      // Sync has not been enabled on our device
      name: 'idle';
      connectedPeersCount: number;
      syncingPeersCount: number;
    }
  | {
      // Sync has been enabled on our device but none of the other connected devices
      name: 'waiting';
      connectedPeersCount: number;
      syncingPeersCount: number;
    }
  | {
      // Sync is occurring between us and some other device(s)
      name: 'syncing';
      connectedPeersCount: number;
      syncingPeersCount: number;
      progress: number;
    }
  | {
      // Sync has finished with some - but not all - connected devices
      name: 'complete-partial';
      connectedPeersCount: number;
      syncingPeersCount: number;
      progress: number;
    }
  | {
      // Sync has finished with all connected devices
      name: 'complete-full';
      connectedPeersCount: number;
      syncingPeersCount: number;
      progress: number;
    };

const m = defineMessages({
  devicesFound: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesFound',
    defaultMessage:
      '{count} {count, plural, one {Device} other {Devices}} found',
  },

  noDevicesAvailableToSync: {
    id: 'screens.Sync.ProjectSyncDisplay.noDevicesAvailableToSync',
    defaultMessage: 'No devices available to sync',
  },
  devicesAvailableToSync: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesAvailableToSync',
    defaultMessage:
      '{count} {count, plural, one {device} other {devices}} available',
  },
  waitingForDevices: {
    id: 'screens.Sync.ProjectSyncDisplay.waitingForDevices',
    defaultMessage: 'Waiting for devices',
  },
  syncingWithDevices: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingWithDevices',
    defaultMessage:
      'Syncing with {active} out of {total} {total, plural, one {device} other {devices}}',
  },
  syncingCompleteButWaitingForOthers: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingCompleteButWaitingForOthers',
    defaultMessage:
      'Complete! Waiting for {count} {count, plural, one {device} other {devices}}',
  },
  syncingFullyComplete: {
    id: 'screens.Sync.ProjectSyncDisplay.syncingFullyComplete',
    defaultMessage: "Complete! You're up to date",
  },
  allDataSynced: {
    id: 'screens.Sync.ProjectSyncDisplay.allDataSynced',
    defaultMessage: 'All data synced',
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
    defaultMessage:
      '{active} out of {total} {total, plural, one {device} other {devices}}…',
  },
  progressLabelComplete: {
    id: 'screens.Sync.ProjectSyncDisplay.progressLabelComplete',
    defaultMessage:
      '{count} out of {count} {count, plural, one {device} other {devices}}',
  },
  progressSyncPercentage: {
    id: 'screens.Sync.ProjectSyncDisplay.syncProgress',
    defaultMessage: '{value}%',
  },

  startSync: {
    id: 'screens.Sync.ProjectSyncDisplay.startSync',
    defaultMessage: 'Start Sync',
  },
  stop: {
    id: 'screens.Sync.ProjectSyncDisplay.stop',
    defaultMessage: 'Stop',
  },
  allCaughtUp: {
    id: 'screens.Sync.ProjectSyncDisplay.allCaughtUp',
    defaultMessage: "You're all caught up!",
  },
});

export const ProjectSyncDisplay = ({
  syncState,
  projectName,
}: {
  syncState: SyncState;
  projectName?: string;
}) => {
  const {formatMessage: t} = useIntl();
  const queryClient = useQueryClient();
  const navigation = useNavigationFromRoot();
  const {projectApi, projectId} = useActiveProject();
  const progress = useDataSyncProgress();

  const connectedPeersCount = getConnectedPeersCount(
    syncState.remoteDeviceSyncState,
  );

  const syncingPeersCount = getSyncingPeersCount(
    syncState.remoteDeviceSyncState,
  );

  const syncStage = deriveSyncStage({
    progress,
    connectedPeersCount,
    syncingPeersCount,
    dataSyncEnabled: syncState.data.isSyncEnabled,
  });

  // stops sync when user leaves sync screen.
  // The api allows us to continue syncing even if the user is not on the sync screen, but for simplicity we are only allowing sync while on the sync screen.
  // In the future we can easily enable background sync, there are just some UI questions that need to answered before we do that.
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      projectApi.$sync.stop();
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY, projectId]});
    });

    return unsubscribe;
  }, [navigation, projectApi, queryClient, projectId]);

  // TODO: Autostop data sync upon leaving screen while in specific state
  // const shouldAutostopSyncWhenLeavingScreen = syncState.data.isSyncEnabled && syncStage.name === 'complete-full';
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('beforeRemove', () => {
  //     projectApi.$sync.setAutostopDataSyncTimeout(30_000);
  //   });

  //   return unsubscribe;
  // }, [navigation, projectApi, shouldAutostopSyncWhenLeavingScreen]);

  let dockContent: React.ReactNode;
  let syncInfoContent: React.ReactNode;

  switch (syncStage.name) {
    case 'idle': {
      dockContent = (
        <Button
          fullWidth
          variant="contained"
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.start();
          }}>
          <View style={styles.buttonContentContainer}>
            <SyncIcon size={20} />
            <Text style={styles.buttonTextPrimary}>{t(m.startSync)}</Text>
          </View>
        </Button>
      );

      syncInfoContent = (
        <Text style={styles.titleText}>
          {syncStage.connectedPeersCount > 0
            ? t(m.devicesAvailableToSync, {
                count: syncStage.connectedPeersCount,
              })
            : t(m.noDevicesAvailableToSync)}
        </Text>
      );
      break;
    }
    case 'waiting': {
      dockContent = (
        <Button
          fullWidth
          variant="outlined"
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}>
          <View style={styles.buttonContentContainer}>
            <StopIcon size={20} color={BLACK} />
            <Text style={styles.buttonTextSecondary}>{t(m.stop)}</Text>
          </View>
        </Button>
      );

      syncInfoContent = (
        <>
          <Text style={styles.titleText}>{t(m.waitingForDevices)}</Text>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    case 'syncing': {
      dockContent = (
        <Button
          fullWidth
          variant="outlined"
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}>
          <View style={styles.buttonContentContainer}>
            <StopIcon size={20} color={BLACK} />
            <Text style={styles.buttonTextSecondary}>{t(m.stop)}</Text>
          </View>
        </Button>
      );

      syncInfoContent = (
        <>
          <Text style={styles.titleText}>
            {syncStage.progress === 0
              ? t(m.waitingForDevices)
              : t(m.syncingWithDevices, {
                  active: syncingPeersCount,
                  total: connectedPeersCount,
                })}
          </Text>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    case 'complete-partial': {
      dockContent = (
        <Button
          fullWidth
          variant="outlined"
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}>
          <View style={styles.buttonContentContainer}>
            <StopIcon size={20} color={BLACK} />
            <Text style={styles.buttonTextSecondary}>{t(m.stop)}</Text>
          </View>
        </Button>
      );

      syncInfoContent = (
        <>
          <Text style={styles.titleText}>
            {t(m.syncingCompleteButWaitingForOthers, {
              count:
                syncStage.connectedPeersCount - syncStage.syncingPeersCount,
            })}
          </Text>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    case 'complete-full': {
      dockContent = (
        <Button variant="text" disabled onPress={() => {}}>
          <Text style={styles.buttonTextSecondary}>{t(m.allCaughtUp)}</Text>
        </Button>
      );

      syncInfoContent = (
        <>
          <View>
            <Text style={styles.titleText}>{t(m.syncingFullyComplete)}</Text>
            <Text style={styles.subtitleText}>{t(m.allDataSynced)}</Text>
          </View>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    default: {
      throw new ExhaustivenessError(
        // @ts-expect-error
        syncState.status,
      );
    }
  }

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={dockContent}>
      <View style={styles.projectInfoContainer}>
        <ObservationsProjectImage />
        {projectName && (
          <Text style={styles.projectNameText}>{projectName}</Text>
        )}
        <View style={styles.connectedDevicesInfoContainer}>
          <WifiIcon color={DARK_GREY} size={20} />
          <Text>{t(m.devicesFound, {count: connectedPeersCount})}</Text>
        </View>
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
      progressLabel = t(m.progressLabelWithDeviceCount, {
        active: stage.syncingPeersCount,
        total: stage.connectedPeersCount,
      });
      break;
    }
    case 'complete-full': {
      progressLabel = t(m.progressLabelComplete, {
        count: stage.connectedPeersCount,
      });
      break;
    }
    default: {
      throw new ExhaustivenessError(
        // @ts-expect-error
        stage.name,
      );
    }
  }

  return (
    <View style={styles.syncProgressContainer}>
      <View style={styles.syncProgressTextContainer}>
        {stage.name === 'complete-full' ? (
          <DoneIcon color={DARK_GREEN} size={20} />
        ) : (
          <SyncIcon color={COMAPEO_BLUE} size={20} />
        )}
        <Text
          style={[
            styles.syncProgressLabel,
            stage.name === 'complete-full' && {color: DARK_GREEN},
          ]}>
          {progressLabel}
        </Text>
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
        <Text style={styles.syncProgressText}>
          {t(m.progressSyncPercentage, {
            value: Math.round(stage.progress * 100),
          })}
        </Text>
      )}
    </View>
  );
}

function deriveSyncStage({
  progress,
  connectedPeersCount,
  syncingPeersCount,
  dataSyncEnabled,
}: {
  progress: number | null;
  connectedPeersCount: number;
  syncingPeersCount: number;
  dataSyncEnabled: boolean;
}): SyncStage {
  if (dataSyncEnabled) {
    if (progress === null || connectedPeersCount === 0) {
      return {
        name: 'waiting',
        connectedPeersCount,
        syncingPeersCount,
      };
    }

    if (progress === 1) {
      if (connectedPeersCount === syncingPeersCount) {
        return {
          name: 'complete-full',
          syncingPeersCount,
          connectedPeersCount,
          progress,
        };
      } else {
        return {
          name: 'complete-partial',
          syncingPeersCount,
          connectedPeersCount,
          progress,
        };
      }
    } else {
      return {
        name: 'syncing',
        connectedPeersCount,
        syncingPeersCount,
        progress,
      };
    }
  } else {
    if (progress === 1) {
      return {
        name:
          connectedPeersCount === syncingPeersCount
            ? 'complete-full'
            : 'complete-partial',
        connectedPeersCount,
        syncingPeersCount,
        progress,
      };
    } else {
      return {
        name: 'idle',
        connectedPeersCount,
        syncingPeersCount,
      };
    }
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 40,
    gap: 36,
  },
  projectInfoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  connectedDevicesInfoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  projectNameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 40,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 24,
    textAlign: 'center',
  },
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextPrimary: {
    fontWeight: 'bold',
    fontSize: 20,
    color: WHITE,
  },
  buttonTextSecondary: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  syncProgressContainer: {
    gap: 12,
  },
  syncProgressTextContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  syncProgressLabel: {
    fontSize: 20,
    color: COMAPEO_BLUE,
  },
  syncProgressText: {
    color: MEDIUM_GREY,
    alignSelf: 'flex-end',
  },
});
