import {useEffect} from 'react';
import {useApi} from './contexts/ApiContext';
import {useQueryClient} from '@tanstack/react-query';
import {INVITE_KEY} from './hooks/server/invites';

export const initializeInviteListener = () => {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();

  useEffect(() => {
    function resetInvitesCache() {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    }

    mapeoApi.invite.addListener('invite-received', resetInvitesCache);

    mapeoApi.invite.addListener('invite-removed', resetInvitesCache);

    return () => {
      mapeoApi.invite.removeListener('invite-received', resetInvitesCache);

      mapeoApi.invite.removeListener('invite-removed', resetInvitesCache);
    };
  }, [queryClient, mapeoApi]);
};
