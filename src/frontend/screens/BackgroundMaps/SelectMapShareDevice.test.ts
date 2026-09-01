import {type ComapeoCoreClientApi} from '@comapeo/ipc';
import type {MemberApi} from '@comapeo/core';
import {getSelectableDevicesForMapShare} from './SelectMapShareDevice';
import {COORDINATOR_ROLE_ID, MEMBER_ROLE_ID} from '../../sharedTypes';

type PublicPeerInfo = Awaited<
  ReturnType<ComapeoCoreClientApi['listLocalPeers']>
>[number];

function mockPeer(
  deviceId: string,
  name: string,
  deviceType: 'mobile' | 'desktop' = 'mobile',
  status: 'connected' | 'disconnected' | undefined = 'connected',
  mapShareSupported: boolean = true,
): PublicPeerInfo {
  return {
    deviceId,
    name,
    deviceType,
    status,
    supportedFeatures: {mapShare: mapShareSupported},
  } as PublicPeerInfo;
}

function mockMember(
  deviceId: string,
  roleId: MemberApi.RoleId,
  deviceType: 'mobile' | 'desktop' = 'mobile',
): MemberApi.ActiveMemberInfo {
  return {
    deviceId,
    name: `Device ${deviceId}`,
    role: {
      // @ts-expect-error Sufficient for testing purposes
      roleId,
    },
    deviceType,
    joinedAt: new Date().toISOString(),
  };
}

describe('getSelectableDevicesForMapShare', () => {
  it('should return only peers that are project members', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1'),
      mockPeer('peer-2', 'Peer 2'),
      mockPeer('peer-3', 'Peer 3'),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      projectMembers: [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', MEMBER_ROLE_ID),
      ],
    });

    expect(result).toHaveLength(2);
    expect(result.map(p => p.deviceId)).toEqual(['peer-1', 'peer-2']);
  });

  it('should return empty array when there are no project members', () => {
    const peers = [mockPeer('peer-1', 'Peer 1'), mockPeer('peer-2', 'Peer 2')];

    const result = getSelectableDevicesForMapShare({
      peers,
      projectMembers: [],
    });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when no peers exist', () => {
    const peers: PublicPeerInfo[] = [];

    const result = getSelectableDevicesForMapShare({
      peers,
      projectMembers: [mockMember('member-1', COORDINATOR_ROLE_ID)],
    });

    expect(result).toHaveLength(0);
  });

  it('should filter peers to only those that are project members', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1'),
      mockPeer('peer-2', 'Peer 2'),
      mockPeer('peer-3', 'Peer 3'),
      mockPeer('peer-4', 'Peer 4'),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      projectMembers: [
        mockMember('peer-2', COORDINATOR_ROLE_ID),
        mockMember('peer-4', MEMBER_ROLE_ID),
      ],
    });

    expect(result).toHaveLength(2);
    expect(result.map(p => p.deviceId)).toEqual(['peer-2', 'peer-4']);
  });

  it('should include project member peers regardless of connection status', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1', 'mobile', 'connected'),
      mockPeer('peer-2', 'Peer 2', 'mobile', 'disconnected'),
      mockPeer('peer-3', 'Peer 3', 'mobile', undefined),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      projectMembers: [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', COORDINATOR_ROLE_ID),
        mockMember('peer-3', MEMBER_ROLE_ID),
      ],
    });

    expect(result).toHaveLength(3);
    expect(result).toEqual(peers);
  });

  it('should exclude peers that do not support map share', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1', 'mobile', 'connected', true),
      mockPeer('peer-2', 'Peer 2', 'mobile', 'connected', false),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      projectMembers: [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', MEMBER_ROLE_ID),
      ],
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.deviceId).toBe('peer-1');
  });

  it('should exclude desktop and server peers even if they are project members', () => {
    const peers = [
      mockPeer('peer-1', 'Peer 1', 'mobile', 'connected'),
      mockPeer('peer-2', 'Peer 2', 'desktop', 'connected'),
    ];

    const result = getSelectableDevicesForMapShare({
      peers,
      projectMembers: [
        mockMember('peer-1', COORDINATOR_ROLE_ID),
        mockMember('peer-2', COORDINATOR_ROLE_ID),
      ],
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.deviceId).toBe('peer-1');
  });
});
