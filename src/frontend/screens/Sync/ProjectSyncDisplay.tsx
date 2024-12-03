import * as React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View, Text} from 'react-native';
import {Bar as ProgressBar} from 'react-native-progress';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {OBSERVATION_KEY} from '../../hooks/server/observations';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDataSyncProgress} from '../../hooks/useSyncState';
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
import {
  deriveSyncStage,
  getConnectedPeersCount,
  getSyncingPeersCount,
  type SyncStage,
  type SyncState,
} from '../../lib/sync';
import {Button} from '../../sharedComponents/Button';
import {
  DoneIcon,
  StopIcon,
  SyncIcon,
  WifiIcon,
} from '../../sharedComponents/icons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {REMOTE_DETECTION_ALERTS_KEY} from '../../hooks/server/remoteDetectionAlert';

const m = defineMessages({
  devicesFound: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesFound',
    defaultMessage: 'Devices found',
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
    defaultMessage: 'You are syncing with your team',
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
    defaultMessage: 'Waiting for other devices',
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
// This component has headers that vary from the design system by request of sabella. The headers are manually set to rubik 400 at size 32
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
        // TODO: All queries associated with project should be invalidated
        queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY, projectId]});

        queryClient.invalidateQueries({
          queryKey: [REMOTE_DETECTION_ALERTS_KEY, projectId],
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
        <Button
          fullWidth
          variant="contained"
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.start();
          }}>
          <View style={styles.buttonContentContainer}>
            <SyncIcon size={20} />
            <HeaderText variant="header5" style={styles.buttonTextPrimary}>
              {t(m.startSync)}
            </HeaderText>
          </View>
        </Button>
      );

      syncInfoContent = (
        <Text style={styles.titleText}>
          {syncStage.connectedPeersCount > 0
            ? t(m.devicesAvailableToSync)
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
            <HeaderText variant="header5">{t(m.stop)}</HeaderText>
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
            <HeaderText variant="header5">{t(m.stop)}</HeaderText>
          </View>
        </Button>
      );

      syncInfoContent = (
        <>
          <Text style={styles.titleText}>
            {syncStage.progress === 0
              ? t(m.waitingForDevices)
              : t(m.syncingWithDevices)}
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
            <HeaderText variant="header5">{t(m.stop)}</HeaderText>
          </View>
        </Button>
      );

      syncInfoContent = (
        <>
          <Text style={styles.titleText}>
            {t(m.syncingCompleteButWaitingForOthers)}
          </Text>
          <SyncProgress stage={syncStage} />
        </>
      );

      break;
    }
    case 'complete-full': {
      dockContent = syncState.data.isSyncEnabled ? (
        <Button
          fullWidth
          variant="outlined"
          onPress={() => {
            // TODO: Catch/surface error
            projectApi.$sync.stop();
          }}>
          <View style={styles.buttonContentContainer}>
            <StopIcon size={20} color={BLACK} />
            <HeaderText variant="header5">{t(m.stop)}</HeaderText>
          </View>
        </Button>
      ) : (
        <Button variant="text" disabled onPress={() => {}}>
          <HeaderText variant="header5">{t(m.allCaughtUp)}</HeaderText>
        </Button>
      );

      syncInfoContent = (
        <>
          <View>
            <Text style={styles.titleText}>{t(m.syncingFullyComplete)}</Text>
            <HeaderText variant="header2" style={styles.subtitleText}>
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
          <HeaderText variant="header2">{projectName}</HeaderText>
        )}
        <View style={styles.connectedDevicesInfoContainer}>
          <WifiIcon color={DARK_GREY} size={20} />
          <BodyText>{t(m.devicesFound)}</BodyText>
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
      progressLabel = t(m.progressLabelWithDeviceCount);
      break;
    }
    case 'complete-full': {
      progressLabel = '';
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
        <HeaderText
          variant="header3"
          style={{
            ...styles.syncProgressLabel,
            ...(stage.name === 'complete-full' && {color: DARK_GREEN}),
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
        <BodyText style={styles.syncProgressText}>
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
  titleText: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Rubik_400Regular',
  },
  subtitleText: {
    textAlign: 'center',
  },
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextPrimary: {
    color: WHITE,
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
    color: COMAPEO_BLUE,
  },
  syncProgressText: {
    color: MEDIUM_GREY,
    alignSelf: 'flex-end',
  },
});
