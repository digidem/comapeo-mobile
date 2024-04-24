import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Bar as ProgressBar} from 'react-native-progress';
import {useProject} from '../../hooks/server/projects';
import {SyncState, useSyncProgress} from '../../hooks/useSyncState';
import ObservationsProjectImage from '../../images/ObservationsProject.svg';
import {
  BLACK,
  COMAPEO_BLUE,
  DARK_GREY,
  LIGHT_GREY,
  MEDIUM_GREY,
  WHITE,
} from '../../lib/styles';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Button} from '../../sharedComponents/Button';
import {Text} from '../../sharedComponents/Text';
import {StopIcon, SyncIcon, WifiIcon} from '../../sharedComponents/icons';
import {useQueryClient} from '@tanstack/react-query';
import {OBSERVATION_KEY} from '../../hooks/server/observations';
import {useFocusEffect} from '@react-navigation/native';

const m = defineMessages({
  deviceName: {
    id: 'screens.Sync.ProjectSyncDisplay.deviceName',
    defaultMessage: 'Your device name is {name}',
  },
  devicesNearby: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesNearby',
    defaultMessage:
      '{count} {count, plural, one {device} other {devices}} nearby/connected',
  },
  buttonTextSync: {
    id: 'screens.Sync.ProjectSyncDisplay.buttonTextSync',
    defaultMessage: 'Sync',
  },
  buttonTextStop: {
    id: 'screens.Sync.ProjectSyncDisplay.buttonTextStop',
    defaultMessage: 'Stop',
  },
  buttonTextDone: {
    id: 'screens.Sync.ProjectSyncDisplay.buttonTextDone',
    defaultMessage: "You're all caught up",
  },
  noDevicesSyncing: {
    id: 'screens.Sync.ProjectSyncDisplay.noDevicesSyncing',
    defaultMessage: 'No Devices are Syncing',
  },
  devicesWaitingToSync: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesWaitingToSync',
    defaultMessage:
      '{count} {count, plural, one {Device} other {Devices}} Waiting to Sync with you',
  },
  devicesSyncing: {
    id: 'screens.Sync.ProjectSyncDisplay.devicesSyncing',
    defaultMessage:
      'Syncing with {count} {count, plural, one {Device} other {Devices}}',
  },
  upToDate: {
    id: 'screens.Sync.ProjectSyncDisplay.upToDate',
    defaultMessage: 'Up to Date!\nNo data to Sync',
  },
  syncing: {
    id: 'screens.Sync.ProjectSyncDisplay.syncing',
    defaultMessage: 'Syncing…',
  },
  syncProgress: {
    id: 'screens.Sync.ProjectSyncDisplay.syncProgress',
    defaultMessage: '{value}%',
  },
});

export const ProjectSyncDisplay = ({
  syncState,
  projectName,
  deviceName,
}: {
  syncState: SyncState;
  projectName: string;
  deviceName: string;
}) => {
  const {formatMessage: t} = useIntl();

  const project = useProject();
  const queryClient = useQueryClient();

  const {connectedPeers, data, initial} = syncState;
  const isSyncDone = !initial.dataToSync && !data.dataToSync;

  // stops sync when user leaves sync screen. The api allows us to continue syncing even if the user is not on the sync screen, but for simplicity we are only allowing sync while on the sync screen. In the future we can easily enable background sync, there are just some UI questions that need to answered before we do that.
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        project.$sync.stop();
        queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY]});
      };
    }, [project, queryClient]),
  );

  const isDataSyncEnabled = data.syncing;

  const devicesSyncingText = isSyncDone
    ? t(m.upToDate)
    : !isDataSyncEnabled && connectedPeers === 0
      ? t(m.noDevicesSyncing)
      : t(
          !isDataSyncEnabled && connectedPeers > 0
            ? m.devicesWaitingToSync
            : m.devicesSyncing,
          {count: connectedPeers},
        );

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={
        isDataSyncEnabled && !isSyncDone ? (
          <Button
            fullWidth
            variant="outlined"
            onPress={() => {
              project.$sync.stop();
            }}>
            <View style={styles.buttonContentContainer}>
              <StopIcon size={20} color={BLACK} />
              <Text style={styles.buttonTextSecondary}>
                {t(m.buttonTextStop)}
              </Text>
            </View>
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onPress={() => {
              if (isSyncDone) return;
              project.$sync.start();
            }}>
            <View style={styles.buttonContentContainer}>
              {isSyncDone ? (
                <Text style={styles.buttonTextPrimary}>
                  {t(m.buttonTextDone)}
                </Text>
              ) : (
                <>
                  <SyncIcon size={20} />
                  <Text style={styles.buttonTextPrimary}>
                    {t(m.buttonTextSync)}
                  </Text>
                </>
              )}
            </View>
          </Button>
        )
      }>
      <View style={styles.projectInfoContainer}>
        <ObservationsProjectImage />
        {projectName && <Text style={styles.projectName}>{projectName}</Text>}
        {deviceName && (
          <Text style={styles.deviceName}>
            {t(m.deviceName, {name: deviceName})}
          </Text>
        )}
        <View style={styles.connectedDevicesInfo}>
          <WifiIcon color={DARK_GREY} size={20} />
          <Text>{t(m.devicesNearby, {count: connectedPeers})}</Text>
        </View>
      </View>
      <Text style={styles.titleText}>{devicesSyncingText}</Text>
      {!isSyncDone && isDataSyncEnabled && <SyncProgress />}
    </ScreenContentWithDock>
  );
};

function SyncProgress() {
  const {formatMessage: t} = useIntl();

  const progress = useSyncProgress();

  const dynamicProgressBarProps =
    progress === null
      ? {indeterminate: true, indeterminateAnimationDuration: 2000}
      : {
          progress,
          indeterminate: false,
        };

  return (
    <View style={styles.syncProgressContainer}>
      <View style={styles.syncProgressTextContainer}>
        <SyncIcon color={COMAPEO_BLUE} size={20} />
        <Text style={styles.syncProgressTitleText}>{t(m.syncing)}</Text>
      </View>
      <ProgressBar
        {...dynamicProgressBarProps}
        height={10}
        width={null}
        borderRadius={0}
        color={COMAPEO_BLUE}
        unfilledColor={LIGHT_GREY}
        borderColor={WHITE}
      />

      {progress !== null && (
        <Text style={styles.syncProgressText}>
          {t(m.syncProgress, {value: Math.round(progress * 100)})}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 36,
  },
  projectInfoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  connectedDevicesInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deviceName: {
    color: MEDIUM_GREY,
  },
  syncInfo: {
    gap: 20,
  },
  titleText: {
    fontSize: 40,
    textAlign: 'center',
  },
  descriptionText: {
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
