import {useCallback, useEffect, useState} from 'react';
import {useApi} from '../contexts/ApiContext';
import {useQueryClient} from '@tanstack/react-query';
import {INVITE_KEY} from './server/invites';
import {MapBuffers} from '@comapeo/core/dist/types';
import {
  InviteInternal,
  InviteRemovalReason,
} from '@comapeo/core/dist/invite-api';

export const useProjectInvitesListener = ({
  inviteId,
  bottomSheetIsOpen,
}: {
  inviteId?: string;
  bottomSheetIsOpen: boolean;
}) => {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();

  const [currentInviteCanceled, setCurrentInviteCancelled] = useState(false);

  const resetInvitesCache = useCallback(() => {
    queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
  }, [queryClient]);

  useEffect(() => {
    function shouldInterceptCancel(
      val: MapBuffers<InviteInternal>,
      reason: InviteRemovalReason,
    ) {
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
