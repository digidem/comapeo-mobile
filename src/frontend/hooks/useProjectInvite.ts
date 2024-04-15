import {
  useAcceptInvite,
  usePendingInvites,
  useRejectInvite,
} from './server/invites';
import {useApi} from '../contexts/ApiContext';
import {useCallback} from 'react';

export function useProjectInvite() {
  const invites = usePendingInvites().data;
  // this will eventually sort invite by date
  const invite = invites[0];
  const acceptMutation = useAcceptInvite(invite?.inviteId);
  const rejectMutation = useRejectInvite(invite?.inviteId);
  const mapeoApi = useApi();

  const resetState = () => {
    acceptMutation.reset();
    rejectMutation.reset();
  };

  const clearAllInvites = useCallback(() => {
    invites.forEach(inv => {
      mapeoApi.invite.reject(inv);
    });
  }, [invites, mapeoApi]);

  return {
    accept: acceptMutation,
    reject: rejectMutation,
    resetState,
    invite: invite,
    numberOfInvites: invites.length,
    clearAllInvites: clearAllInvites,
  };
}
