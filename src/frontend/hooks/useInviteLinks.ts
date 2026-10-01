import * as React from 'react';
import type {MemberApi} from '@comapeo/core';
import type {DeviceType} from '../sharedTypes';

export type InviteLink = {
  url: string;
  inviteId: string;
  roleId: MemberApi.RoleIdForNewInvite;
  createdAt: number;
  expiresAt: number;
};

/** What the invitor needs to show on the accept/deny sheet. */
export type JoinRequestDetails = {
  inviteId: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  projectName: string;
  roleId: MemberApi.RoleIdForNewInvite;
};

// This is the only place the invite link screens talk to the backend, so it is
// the only file that should need to change once the real API is reachable.
// Everything here maps onto core: $member.createInviteLink / listInviteLinks /
// cancelInviteLink / acceptInviteLinkRequest / denyInviteLinkRequest, plus the
// invite-link-join-request event and a local peer lookup for the device name.

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// A real link, so the share sheet and the parser see the shape they will get.
// The trailing param is ignored by the parser and just keeps stub urls unique.
const STUB_URL =
  'https://a.comapeo.app/invite#i=M6GT38D1M6GT38D1M6GT38D1M6GT38D1M6GT38D1M6GT38D1M6GG&d=PASB5CNJPASB5CNJPASB5CNJPASB5CNJPASB5CNJPASB5CNJPAS0&n=Cindy&p=Treeline+East&e=1790716859';

// Stands in for the links core would be storing, so the screens can be clicked
// through before the real API is reachable. Goes away with the rest of the stubs.
let storedLinks: InviteLink[] = [];
const listeners = new Set<() => void>();

function setStoredLinks(next: InviteLink[]) {
  storedLinks = next;
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function randomInviteId() {
  return Array.from({length: 64}, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

export function useManyInviteLinks(): InviteLink[] {
  return React.useSyncExternalStore(subscribe, () => storedLinks);
}

export function useCreateInviteLink() {
  return async (roleId: MemberApi.RoleIdForNewInvite): Promise<InviteLink> => {
    const inviteId = randomInviteId();
    const inviteLink: InviteLink = {
      url: `${STUB_URL}&s=${inviteId.slice(0, 8)}`,
      inviteId,
      roleId,
      createdAt: Date.now(),
      expiresAt: Date.now() + ONE_DAY_MS,
    };
    setStoredLinks([...storedLinks, inviteLink]);
    return inviteLink;
  };
}

export function useCancelInviteLink() {
  return async (url: string): Promise<void> => {
    setStoredLinks(storedLinks.filter(link => link.url !== url));
  };
}

/** The request the invitor is being asked to approve, or null when there is none. */
export function useJoinRequestReceived(): JoinRequestDetails | null {
  return null;
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
