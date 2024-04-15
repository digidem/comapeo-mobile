import {
  useAcceptInvite,
  useClearAllPendingInvites,
  usePendingInvites,
  useRejectInvite,
} from './server/invites';
import {useApi} from '../contexts/ApiContext';

export function useProjectInvite() {
  const invites = usePendingInvites().data;
  // this will eventually sort invite by date
  const invite = invites[0];
  const acceptMutation = useAcceptInvite();
  const rejectMutation = useRejectInvite();
  const clearAllInvites = useClearAllPendingInvites();
  const mapeoApi = useApi();

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
