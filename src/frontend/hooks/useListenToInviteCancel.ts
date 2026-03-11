import {useEffect} from 'react';
import type {InviteApi} from '@comapeo/core';
import {useClientApi} from '@comapeo/core-react';

import {useNavigationFromRoot} from './useNavigationWithTypes';

export function useListenToInviteCancel(inviteId: string) {
  const navigation = useNavigationFromRoot();
  const {invite: mapeoApiInvite} = useClientApi();
  useEffect(() => {
    function navigateOnCancel(invite: InviteApi.Invite) {
      if (invite.inviteId !== inviteId) return;

      if (invite.state === 'canceled') {
        navigation.replace('InviteCanceled', {
          projectName: invite.projectName,
        });
        return;
      }
    }

    mapeoApiInvite.addListener('invite-updated', navigateOnCancel);

    return () => {
      mapeoApiInvite.removeListener('invite-updated', navigateOnCancel);
    };
  }, [mapeoApiInvite, inviteId, navigation]);
}
