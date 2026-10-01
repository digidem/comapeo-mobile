import type {MemberApi} from '@comapeo/core';

export type InviteLink = {
  url: string;
  inviteId: string;
  roleId: MemberApi.RoleIdForNewInvite;
  createdAt: number;
  expiresAt: number;
};

// This is the only place the invite link screens talk to the backend, so it is
// the only file that should need to change once we can actually create links.
// @comapeo/core-react has not published useManyInviteLinks, useCreateInviteLink
// or useCancelInviteLink yet. Swap the bodies below for those when it does.

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// A real link, so the share sheet and the parser see the shape they will get.
const STUB_URL =
  'https://a.comapeo.app/invite#i=M6GT38D1M6GT38D1M6GT38D1M6GT38D1M6GT38D1M6GT38D1M6GG&d=PASB5CNJPASB5CNJPASB5CNJPASB5CNJPASB5CNJPASB5CNJPAS0&n=Cindy&p=Treeline+East&e=1790716859';
const STUB_INVITE_ID = 'a1'.repeat(32);

export function useManyInviteLinks(): InviteLink[] {
  return [];
}

export function useCreateInviteLink() {
  return async (roleId: MemberApi.RoleIdForNewInvite): Promise<InviteLink> => ({
    url: STUB_URL,
    inviteId: STUB_INVITE_ID,
    roleId,
    createdAt: Date.now(),
    expiresAt: Date.now() + ONE_DAY_MS,
  });
}

export function useCancelInviteLink() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- the real version passes the url to cancelInviteLink
  return async (url: string): Promise<void> => {};
}
