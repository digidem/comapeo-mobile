import type {InviteLink} from '../lib/inviteLinks';
import type {JoinFailureCode} from '../screens/Invites/joinFailure';

export type JoinRequestState =
  | {status: 'connecting' | 'connected' | 'accepted'}
  | {status: 'completed'; projectId: string}
  | {status: 'failed'; errorCode: JoinFailureCode};

// This is the only place the invite link screens talk to the backend, so it is
// the only file that should need to change once we can actually join.
// Joining needs manager.inviteLinks.createJoinRequest plus the
// join-request-update event. That event is in @comapeo/ipc 10.1.0-pre.0, but
// @comapeo/core-react has not released hooks for it yet. They are on the
// experiments/invite-over-internet branch, and published 12.0.4 still has
// ipc ^9. Once that is published, replace the body below with
// useSingleJoinRequest({inviteId}).
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the real version passes invite.inviteIdString to useSingleJoinRequest
export function useJoinRequest(invite: InviteLink): JoinRequestState {
  return {status: 'connecting'};
}
