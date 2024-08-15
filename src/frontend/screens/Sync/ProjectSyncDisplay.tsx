import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Bar as ProgressBar} from 'react-native-progress';
import {useQueryClient} from '@tanstack/react-query';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {OBSERVATION_KEY} from '../../hooks/server/observations';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  SyncState,
  getConnectedPeersCount,
  getSyncingPeersCount,
  useSyncProgress,
} from '../../hooks/useSyncState';
import ObservationsProjectImage from '../../images/ObservationsProject.svg';
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

  progressWaiting: {
    id: 'screens.Sync.ProjectSyncDisplay.progressWaiting',
    defaultMessage: 'Waiting…',
  },
  progressSyncing: {
    id: 'screens.Sync.ProjectSyncDisplay.progressSyncing',
    defaultMessage: 'Syncing…',
  },
  progressSyncingWithDeviceCount: {
    id: 'screens.Sync.ProjectSyncDisplay.progressSyncingWithDeviceCount',
    defaultMessage:
      '{active} out of {total} {total, plural, one {device} other {devices}}…',
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
  const {projectApi, projectId} = useActiveProject();
  const queryClient = useQueryClient();
  const navigation = useNavigationFromRoot();

  // TODO: Need to fix how this is calculated
  const progress = useSyncProgress();
  const {formatMessage: t} = useIntl();

  const noProgress = progress === 0 || progress === null;

  // TODO: Maybe memoize
  const connectedPeersCount = getConnectedPeersCount(syncState.deviceSyncState);

  // TODO: Maybe memoize
  const syncingPeersCount = getSyncingPeersCount(syncState.deviceSyncState);

  const isFullySynced =
    progress === 1 &&
    connectedPeersCount > 0 &&
    connectedPeersCount === syncingPeersCount;

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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (syncState.data.isEnabled && isFullySynced) {
        // TODO: Set the sync autostop timeout to 30 seconds
        // projectApi.$sync.setAutostopDataSyncTimeout(30_000)
      }
    });

    return unsubscribe;
  }, [navigation, isFullySynced, projectApi, syncState.data.isEnabled]);

  let dockContent: React.ReactNode;
  let syncInfoContent: React.ReactNode;

  if (syncState.data.isEnabled) {
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
        {isFullySynced ? (
          <View>
            <Text style={styles.titleText}>{t(m.syncingFullyComplete)}</Text>
            <Text style={styles.subtitleText}>{t(m.allDataSynced)}</Text>
          </View>
        ) : (
          <Text style={styles.titleText}>
            {noProgress
              ? t(m.waitingForDevices)
              : progress === 1
                ? t(m.syncingCompleteButWaitingForOthers, {
                    count: connectedPeersCount - syncingPeersCount,
                  })
                : t(m.syncingWithDevices, {
                    active: syncingPeersCount,
                    total: connectedPeersCount,
                  })}
          </Text>
        )}

        <SyncProgress
          progress={progress}
          syncingDeviceCount={syncingPeersCount}
          totalDeviceCount={connectedPeersCount}
        />
      </>
    );
  } else {
    dockContent = isFullySynced ? (
      <Button variant="text" disabled onPress={() => {}}>
        <Text style={styles.buttonTextSecondary}>{t(m.allCaughtUp)}</Text>
      </Button>
    ) : (
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

    syncInfoContent = isFullySynced ? (
      <>
        <Text style={styles.titleText}>{t(m.syncingFullyComplete)}</Text>
        <Text style={styles.subtitleText}>{t(m.allDataSynced)}</Text>

        <SyncProgress
          progress={1}
          syncingDeviceCount={connectedPeersCount}
          totalDeviceCount={connectedPeersCount}
        />
      </>
    ) : (
      <Text style={styles.titleText}>
        {connectedPeersCount > 0
          ? t(m.devicesAvailableToSync, {count: connectedPeersCount})
          : t(m.noDevicesAvailableToSync)}
      </Text>
    );
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
  progress,
  syncingDeviceCount,
  totalDeviceCount,
}: {
  progress: number | null;
  syncingDeviceCount: number;
  totalDeviceCount: number;
}) {
  const {formatMessage: t} = useIntl();
  const noProgress = progress === null || progress === 0;

  const dynamicProgressBarProps = noProgress
    ? {indeterminate: true, indeterminateAnimationDuration: 2000}
    : {
        progress,
        indeterminate: false,
      };

  const completelyDone =
    progress === 1 && syncingDeviceCount === totalDeviceCount;

  return (
    <View style={styles.syncProgressContainer}>
      <View style={styles.syncProgressTextContainer}>
        {completelyDone ? (
          // TODO: use correct icon and color
          <DoneIcon color={DARK_GREEN} size={20} />
        ) : (
          <SyncIcon color={COMAPEO_BLUE} size={20} />
        )}
        <Text
          style={[
            styles.syncProgressTitleText,
            completelyDone && {color: DARK_GREEN},
          ]}>
          {noProgress
            ? t(m.progressWaiting)
            : progress === 1
              ? t(m.progressSyncingWithDeviceCount, {
                  active: syncingDeviceCount,
                  total: totalDeviceCount,
                })
              : t(m.progressSyncing)}
        </Text>
      </View>
      <ProgressBar
        {...dynamicProgressBarProps}
        height={10}
        width={null}
        borderRadius={0}
        color={completelyDone ? DARK_GREEN : COMAPEO_BLUE}
        unfilledColor={LIGHT_GREY}
        borderColor={WHITE}
      />

      {!noProgress && (
        <Text style={styles.syncProgressText}>
          {t(m.progressSyncPercentage, {value: Math.round(progress * 100)})}
        </Text>
      )}
    </View>
  );
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
  syncProgressTitleText: {
    fontSize: 20,
    color: COMAPEO_BLUE,
  },
  syncProgressText: {
    color: MEDIUM_GREY,
    alignSelf: 'flex-end',
  },
});
