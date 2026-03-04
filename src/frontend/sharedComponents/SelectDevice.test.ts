import {getSelectableDevices} from './SelectDevice';
import {type MemberInfo} from '@comapeo/core/dist/member-api';
import {type MapeoClientApi} from '@comapeo/ipc';
import {
  BLOCKED_ROLE_ID,
  COORDINATOR_ROLE_ID,
  LEFT_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../sharedTypes';
import {type useSyncState} from '@comapeo/core-react';

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

function mockMember(
  deviceId: string,
  roleId: string,
  deviceType: 'mobile' | 'desktop' = 'mobile',
): MemberInfo {
  return {
    deviceId,
    name: `Device ${deviceId}`,
    role: {roleId},
    deviceType,
    joinedAt: new Date().toISOString(),
  } as MemberInfo;
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

describe('getSelectableDevices', () => {
  describe('invites mode', () => {
    it('should return all peers when no project members exist', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
        mockPeer('peer-3', 'Peer 3'),
      ];
      const projectMembers: MemberInfo[] = [];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(peers);
    });

    it('should filter out peers that are active project members', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
        mockPeer('peer-3', 'Peer 3'),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', MEMBER_ROLE_ID),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.deviceId).toBe('peer-3');
    });

    it('should return empty array when all peers are active project members', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', MEMBER_ROLE_ID),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(0);
    });

    it('should return empty array when no peers exist', () => {
      const peers: PublicPeerInfo[] = [];
      const projectMembers = [mockMember('member-1', COORDINATOR_ROLE_ID)];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(0);
    });

    it('should handle mixed device types correctly', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1', 'mobile'),
        mockPeer('peer-2', 'Peer 2', 'desktop'),
        mockPeer('peer-3', 'Peer 3', 'mobile'),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID, 'mobile'),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.deviceId)).toEqual(['peer-2', 'peer-3']);
    });

    it('should allow inviting blocked members', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
        mockPeer('peer-3', 'Peer 3'),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', BLOCKED_ROLE_ID),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.deviceId)).toEqual(['peer-2', 'peer-3']);
    });

    it('should allow inviting left members', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
        mockPeer('peer-3', 'Peer 3'),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', LEFT_ROLE_ID),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.deviceId)).toEqual(['peer-2', 'peer-3']);
    });
  });

  describe('shareMap mode', () => {
    it('should return only peers that are in syncState', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
        mockPeer('peer-3', 'Peer 3'),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', MEMBER_ROLE_ID),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'shareMap',
        syncState: mockSyncState(['peer-1', 'peer-2']),
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.deviceId)).toEqual(['peer-1', 'peer-2']);
    });

    it('should return empty array when syncState has no connected devices', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
      ];
      const projectMembers: MemberInfo[] = [];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'shareMap',
        syncState: mockSyncState([]),
      });

      expect(result).toHaveLength(0);
    });

    it('should return empty array when no peers exist', () => {
      const peers: PublicPeerInfo[] = [];
      const projectMembers = [mockMember('member-1', COORDINATOR_ROLE_ID)];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'shareMap',
        syncState: mockSyncState(['member-1']),
      });

      expect(result).toHaveLength(0);
    });

    it('should return empty array when syncState is null', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
      ];
      const projectMembers = [mockMember('peer-1', COORDINATOR_ROLE_ID)];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'shareMap',
        syncState: null,
      });

      expect(result).toHaveLength(0);
    });

    it('should filter peers to only those in syncState', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
        mockPeer('peer-3', 'Peer 3'),
        mockPeer('peer-4', 'Peer 4'),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', COORDINATOR_ROLE_ID),
        mockMember('peer-3', MEMBER_ROLE_ID),
        mockMember('peer-4', MEMBER_ROLE_ID),
      ];

      // Only peer-2 and peer-4 are in syncState (have project open)
      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'shareMap',
        syncState: mockSyncState(['peer-2', 'peer-4']),
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.deviceId)).toEqual(['peer-2', 'peer-4']);
    });

    it('should include all peers that are in syncState regardless of connection status', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1', 'mobile', 'connected'),
        mockPeer('peer-2', 'Peer 2', 'desktop', 'disconnected'),
        mockPeer('peer-3', 'Peer 3', 'mobile', undefined),
      ];
      const projectMembers = [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', COORDINATOR_ROLE_ID),
        mockMember('peer-3', MEMBER_ROLE_ID),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'shareMap',
        syncState: mockSyncState(['peer-1', 'peer-2', 'peer-3']),
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(peers);
    });
  });

  describe('edge cases', () => {
    it('should handle empty peers and members arrays', () => {
      const peers: PublicPeerInfo[] = [];
      const projectMembers: MemberInfo[] = [];

      const invitesResult = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      const shareMapResult = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'shareMap',
        syncState: mockSyncState([]),
      });

      expect(invitesResult).toHaveLength(0);
      expect(shareMapResult).toHaveLength(0);
    });

    it('should handle case where peer deviceId does not match any project member', () => {
      const peers = [
        mockPeer('peer-1', 'Peer 1'),
        mockPeer('peer-2', 'Peer 2'),
      ];
      const projectMembers = [
        mockMember('member-99', COORDINATOR_ROLE_ID),
        mockMember('member-100', MEMBER_ROLE_ID),
      ];

      const result = getSelectableDevices({
        peers,
        projectMembers,
        selectionMode: 'invites',
        syncState: null,
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(peers);
    });
  });
});
