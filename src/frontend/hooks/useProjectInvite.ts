import {
  useAcceptInvite,
  useClearAllPendingInvites,
  usePendingInvites,
  useRejectInvite,
} from './server/invites';

export function useProjectInvite() {
  const invites = usePendingInvites().data;
  // this will eventually sort invite by date
  const invite = invites[0];
  const acceptMutation = useAcceptInvite(invite?.projectPublicId);
  const rejectMutation = useRejectInvite();
  const clearAllInvites = useClearAllPendingInvites();

  const resetState = () => {
    acceptMutation.reset();
    rejectMutation.reset();
  };

  return {
    accept: acceptMutation,
    reject: rejectMutation,
    resetState,
    invite: invite,
    numberOfInvites: invites.length,
    clearAllInvites: () =>
      clearAllInvites.mutate({inviteIds: invites.map(inv => inv.inviteId)}),
  };
}
