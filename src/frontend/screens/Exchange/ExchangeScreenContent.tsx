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
  BLUE_GREY,
  COMAPEO_BLUE,
  DARK_GREEN,
  DARK_ORANGE,
  LIGHT_GREY,
  MEDIUM_GREY,
  NEW_DARK_GREY,
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
import OrangeStar from '../../images/OrangeStar.svg';
import GreyLeaf from '../../images/GreyLeaf.svg';

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
  exchangeTitle: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangeTitle',
    defaultMessage: 'Exchange everything.',
  },
  exchangeMediaDescription: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangeMediaDescription',
    defaultMessage: 'Full size photos and audio.',
  },
  exchangeStorageDescription: {
    id: 'screens.Sync.ProjectSyncDisplay.exchangeStorageDescription',
    defaultMessage: 'Uses more storage.',
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
        <>
          <HeaderText variant="header1" style={styles.exchangeInfoText}>
            {syncStage.connectedPeersCount > 0
              ? t(m.devicesFound)
              : t(m.noDevicesFound)}
          </HeaderText>
          <View style={{height: 120}}></View>
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
          <HeaderText variant="header1" style={styles.exchangeInfoText}>
            {t(m.syncingFullyComplete)}
          </HeaderText>
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

  const devicesAvailableHeader = (
    <View style={styles.syncStatusIconWrapper}>
      <View
        style={[
          styles.syncStatusCircle,
          {
            borderColor:
              syncStage.connectedPeersCount > 0 ? DARK_ORANGE : BLUE_GREY,
          },
        ]}>
        <SyncIcon
          size={28}
          color={syncStage.connectedPeersCount > 0 ? DARK_ORANGE : BLUE_GREY}
        />
      </View>
      {syncStage.connectedPeersCount > 0 ? (
        <OrangeStar
          width={40}
          height={40}
          style={styles.syncStatusOverlayIcon}
        />
      ) : (
        <GreyLeaf width={30} height={30} style={styles.syncStatusOverlayIcon} />
      )}
    </View>
  );

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={dockContent}>
      <View style={styles.wifiCard}>
        <View style={styles.wifiCardContent}>
          <Circle color="#CCE0FF" radius={14} style={styles.signalIndicator}>
            <WifiIconComponent size={16} color={BLACK} />
          </Circle>
          <View style={styles.wifiCardTextContainer}>
            {ssid ? (
              <BodyText style={styles.wifiName}>{ssid}</BodyText>
            ) : (
              <>
                <BodyText>{t(m.wifiCardPlaceholder, {ssid: ''})}</BodyText>
                <BodyText style={styles.wifiName}>{t(m.noWifi)}</BodyText>
              </>
            )}
          </View>
        </View>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.projectInfoContainer}>
          {devicesAvailableHeader}
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
        <View style={styles.exchangeSettingsCard}>
          <HeaderText variant="header6" style={{color: BLACK}}>
            {t(m.exchangeTitle)}
          </HeaderText>
          <BodyText variant="smallMeta" style={{color: NEW_DARK_GREY}}>
            {t(m.exchangeMediaDescription)}
          </BodyText>
          <BodyText variant="smallMeta" style={{color: NEW_DARK_GREY}}>
            {t(m.exchangeStorageDescription)}
          </BodyText>
          {syncStage.name !== 'syncing' && (
            <Button
              variant="text"
              onPress={() => {
                // TODO: open exchange settings bottom sheet
                console.log('Open Exchange Settings');
              }}>
              <HeaderText variant="header6" style={styles.exchangeChangeLink}>
                {t(m.exchangeAction)}
              </HeaderText>
            </Button>
          )}
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
        ) : (
          <SyncIcon color={COMAPEO_BLUE} size={20} />
        )}
        <HeaderText
          variant="header3"
          style={{
            color: stage.name === 'complete-full' ? DARK_GREEN : COMAPEO_BLUE,
          }}></HeaderText>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
    width: '100%',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  wifiCardTextContainer: {
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: 'auto',
    maxWidth: '80%',
  },
  wifiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
    gap: 10,
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
  signalIndicator: {
    elevation: 0,
    backgroundColor: '#CCE0FF',
    borderColor: '#CCE0FF',
  },
  syncStatusIconWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncStatusCircle: {
    width: 80,
    height: 80,
    borderWidth: 6,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncStatusOverlayIcon: {
    position: 'absolute',
    right: -8,
    bottom: -8,
  },
  exchangeSettingsCard: {
    marginTop: 25,
    alignItems: 'center',
  },
  exchangeChangeLink: {
    color: COMAPEO_BLUE,
    marginTop: 12,
  },
  contentWrapper: {
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});
