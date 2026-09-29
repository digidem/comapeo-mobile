import type {InviteLinkParams} from '../lib/inviteLinks';
import type {JoinFailureCode} from '../screens/Invites/joinFailure';

export type JoinRequestState =
  | {status: 'connecting' | 'connected' | 'accepted'}
  | {status: 'completed'; projectId: string}
  | {status: 'failed'; errorCode: JoinFailureCode};

// This is the only place the invite link screens talk to the backend, so it is
// the only file that should need to change once we can actually join.
// Joining needs manager.inviteLinks.createJoinRequest plus the
// join-request-update event. @comapeo/core-react has not published hooks for
// this yet. Once it does, replace the body below with useSingleJoinRequest.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the real version passes invite.inviteIdString to useSingleJoinRequest
export function useJoinRequest(invite: InviteLinkParams): JoinRequestState {
  return {status: 'failed', errorCode: 'JOIN_PROJECT_CANCELLED_ERROR'};
}
