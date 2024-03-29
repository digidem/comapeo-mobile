import {Invite} from '@mapeo/core/dist/invite-api';
import {useAcceptInvite, useInvites, useRejectInvite} from './server/invites';

export function useProjectInvite(): {
  accept: ReturnType<typeof useAcceptInvite>;
  reject: ReturnType<typeof useRejectInvite>;
  resetState: () => void;
  invite: Invite;
} {
  const invites = useInvites().data;
  // this will eventually sort invite by date
  const invite = invites[0];
  const acceptMutation = useAcceptInvite(invite?.inviteId);
  const rejectMutation = useRejectInvite(invite?.inviteId);

  const resetState = () => {
    acceptMutation.reset();
    rejectMutation.reset();
  };

  return {
    accept: acceptMutation,
    reject: rejectMutation,
    resetState,
    invite: invite,
  };
}
