import type {MapeoProjectApi} from '@comapeo/ipc';

export type SyncState = Awaited<
  ReturnType<MapeoProjectApi['$sync']['getState']>
>;

export type SyncStage =
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

export function getDataSyncCountForDevice(
  syncStateForDevice: SyncState['remoteDeviceSyncState'][string],
) {
  const {data} = syncStateForDevice;
  return data.want + data.wanted;
}

export function getConnectedPeersCount(
  deviceSyncState: SyncState['remoteDeviceSyncState'],
): number {
  return Object.keys(deviceSyncState).length;
}

export function getSyncingPeersCount(
  deviceSyncState: SyncState['remoteDeviceSyncState'],
): number {
  let result = 0;

  for (const {data} of Object.values(deviceSyncState)) {
    if (data.isSyncEnabled) {
      result += 1;
    }
  }

  return result;
}

export function deriveSyncStage({
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
