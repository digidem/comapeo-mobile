import {type MapeoClientApi} from '@comapeo/ipc';
import {type useSyncState} from '@comapeo/core-react';
import {getSelectableDevicesForMapShare} from './SelectMapShareDevice';

type PublicPeerInfo = Awaited<
  ReturnType<MapeoClientApi['listLocalPeers']>
>[number];

type SyncState = ReturnType<typeof useSyncState>;

function mockPeer(
  deviceId: string,
  name: string,
  deviceType: 'mobile' | 'desktop' = 'mobile',
  status: 'connected' | 'disconnected' | undefined = 'connected',
): PublicPeerInfo {
  return {
    deviceId,
    name,
    deviceType,
    status,
  } as PublicPeerInfo;
}

function mockSyncState(connectedDeviceIds: string[]): SyncState {
  const remoteDeviceSyncState: Record<
    string,
    {syncing: boolean; progress: number}
  > = {};
  for (const deviceId of connectedDeviceIds) {
    remoteDeviceSyncState[deviceId] = {
      syncing: false,
      progress: 0,
    };
  }
  return {
    remoteDeviceSyncState,
  } as unknown as SyncState;
}

describe('getSelectableDevicesForMapShare', () => {
  it('should return only peers that are on the same project', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1'),
      mockPeer('peer-2', 'Peer 2'),
      mockPeer('peer-3', 'Peer 3'),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      syncState: mockSyncState(['peer-1', 'peer-2']),
    });

    expect(result).toHaveLength(2);
    expect(result.map(p => p.deviceId)).toEqual(['peer-1', 'peer-2']);
  });

  it('should return empty array when there are no devices on same project', () => {
    const peers = [mockPeer('peer-1', 'Peer 1'), mockPeer('peer-2', 'Peer 2')];

    const result = getSelectableDevicesForMapShare({
      peers,
      syncState: mockSyncState([]),
    });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when no peers exist', () => {
    const peers: PublicPeerInfo[] = [];

    const result = getSelectableDevicesForMapShare({
      peers,
      syncState: mockSyncState(['member-1']),
    });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when syncState is null (no devices on same project)', () => {
    const peers = [mockPeer('peer-1', 'Peer 1'), mockPeer('peer-2', 'Peer 2')];

    const result = getSelectableDevicesForMapShare({
      peers,
      syncState: null,
    });

    expect(result).toHaveLength(0);
  });

  it('should filter peers to only those on the same project', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1'),
      mockPeer('peer-2', 'Peer 2'),
      mockPeer('peer-3', 'Peer 3'),
      mockPeer('peer-4', 'Peer 4'),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      syncState: mockSyncState(['peer-2', 'peer-4']),
    });

    expect(result).toHaveLength(2);
    expect(result.map(p => p.deviceId)).toEqual(['peer-2', 'peer-4']);
  });

  it('should include all peers that are on the same project regardless of connection status', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1', 'mobile', 'connected'),
      mockPeer('peer-2', 'Peer 2', 'desktop', 'disconnected'),
      mockPeer('peer-3', 'Peer 3', 'mobile', undefined),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      syncState: mockSyncState(['peer-1', 'peer-2', 'peer-3']),
    });

    expect(result).toHaveLength(3);
    expect(result).toEqual(peers);
  });
});
