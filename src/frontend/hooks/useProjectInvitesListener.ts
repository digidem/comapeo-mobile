import {useCallback, useEffect, useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {Invite, InviteRemovalReason} from '@comapeo/core/dist/invite-api';
import {useClientApi} from '@comapeo/core-react';
import {ROOT_QUERY_KEY} from '../constants';

export const useProjectInvitesListener = ({
  inviteId,
  bottomSheetIsOpen,
}: {
  inviteId?: string;
  bottomSheetIsOpen: boolean;
}) => {
  const mapeoApi = useClientApi();
  const queryClient = useQueryClient();
  function getPendingInvitesQueryKey() {
    return [ROOT_QUERY_KEY, 'invites'] as const;
  }

  const [currentInviteCanceled, setCurrentInviteCancelled] = useState(false);

  const resetInvitesCache = useCallback(() => {
    queryClient.invalidateQueries({queryKey: getPendingInvitesQueryKey()});
  }, [queryClient]);

  useEffect(() => {
    function shouldInterceptCancel(val: Invite, reason: InviteRemovalReason) {
      if (
        reason === 'canceled' &&
        inviteId === val.inviteId &&
        bottomSheetIsOpen
      ) {
        setCurrentInviteCancelled(true);
        return;
      }
      resetInvitesCache();
    }

    mapeoApi.invite.addListener('invite-received', resetInvitesCache);

    mapeoApi.invite.addListener('invite-removed', shouldInterceptCancel);

    return () => {
      mapeoApi.invite.removeListener('invite-received', resetInvitesCache);

      mapeoApi.invite.removeListener('invite-removed', shouldInterceptCancel);
    };
  }, [resetInvitesCache, mapeoApi, inviteId, bottomSheetIsOpen]);

  return {
    resetCacheAndClearCanceled: () => {
      resetInvitesCache();
      setCurrentInviteCancelled(false);
    },
    currentInviteCanceled,
  };
};
