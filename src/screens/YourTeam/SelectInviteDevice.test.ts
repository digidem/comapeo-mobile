import type {MemberApi} from '@comapeo/core';
import {type ComapeoCoreClientApi} from '@comapeo/ipc';
import {getSelectableDevicesForInvite} from './SelectInviteDevice';
import {
  BLOCKED_ROLE_ID,
  COORDINATOR_ROLE_ID,
  LEFT_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../../sharedTypes';

type PublicPeerInfo = Awaited<
  ReturnType<ComapeoCoreClientApi['listLocalPeers']>
>[number];

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
  roleId: MemberApi.RoleId,
  deviceType: 'mobile' | 'desktop' = 'mobile',
): MemberApi.MemberInfo {
  return {
    deviceId,
    name: `Device ${deviceId}`,
    // @ts-expect-error Unsound but enough for testing purposes
    role: {roleId},
    deviceType,
    joinedAt: new Date().toISOString(),
  };
}

describe('getSelectableDevicesForInvite', () => {
  it('should return all peers when no project members exist', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1'),
      mockPeer('peer-2', 'Peer 2'),
      mockPeer('peer-3', 'Peer 3'),
    ];
    const projectMembers: MemberApi.MemberInfo[] = [];

    const result = getSelectableDevicesForInvite({
      peers,
      projectMembers,
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

    const result = getSelectableDevicesForInvite({
      peers,
      projectMembers,
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.deviceId).toBe('peer-3');
  });

  it('should return empty array when all peers are active project members', () => {
    const peers = [mockPeer('peer-1', 'Peer 1'), mockPeer('peer-2', 'Peer 2')];
    const projectMembers = [
      mockMember('peer-1', COORDINATOR_ROLE_ID),
      mockMember('peer-2', MEMBER_ROLE_ID),
    ];

    const result = getSelectableDevicesForInvite({
      peers,
      projectMembers,
    });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when no peers exist', () => {
    const peers: PublicPeerInfo[] = [];
    const projectMembers = [mockMember('member-1', COORDINATOR_ROLE_ID)];

    const result = getSelectableDevicesForInvite({
      peers,
      projectMembers,
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

    const result = getSelectableDevicesForInvite({
      peers,
      projectMembers,
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

    const result = getSelectableDevicesForInvite({
      peers,
      projectMembers,
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

    const result = getSelectableDevicesForInvite({
      peers,
      projectMembers,
    });

    expect(result).toHaveLength(2);
    expect(result.map(p => p.deviceId)).toEqual(['peer-2', 'peer-3']);
  });
});
