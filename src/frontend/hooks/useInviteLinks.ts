import type {MemberApi} from '@comapeo/core';
import {MEMBER_ROLE_ID, type DeviceType} from '../sharedTypes';

/** What the invitor needs to show on the accept/deny sheet. */
export type JoinRequestDetails = {
  inviteId: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  projectName: string;
  projectColor?: string;
  roleId: MemberApi.RoleIdForNewInvite;
};

// Still stubbed: the invitor's incoming request needs the
// invite-link-join-request event plus a local peer lookup for the device name.

// Flip to true to make an incoming join request appear, so the review screens
// can be looked at before the invite-link-join-request event is reachable.
const SIMULATE_INCOMING_JOIN_REQUEST = false;

const STUB_JOIN_REQUEST: JoinRequestDetails = {
  inviteId: 'a1'.repeat(32),
  deviceId: 'b2'.repeat(16),
  deviceName: 'Joy',
  deviceType: 'mobile',
  projectName: 'Treeline East',
  projectColor: '#CCE5CC',
  roleId: MEMBER_ROLE_ID,
};

/** The request the invitor is being asked to approve, or null when there is none. */
export function useJoinRequestReceived(): JoinRequestDetails | null {
  return SIMULATE_INCOMING_JOIN_REQUEST ? STUB_JOIN_REQUEST : null;
}

export function useAcceptJoinRequest() {
  return async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- the real version passes both to acceptInviteLinkRequest
    request: Pick<JoinRequestDetails, 'inviteId' | 'deviceId'>,
  ): Promise<void> => {};
}

export function useDenyJoinRequest() {
  return async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- the real version passes both to denyInviteLinkRequest
    request: Pick<JoinRequestDetails, 'inviteId' | 'deviceId'>,
  ): Promise<void> => {};
}
