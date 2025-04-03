import {Invite} from '@comapeo/core/dist/invite/invite-api';
import {useEffect} from 'react';
import {useNavigationFromRoot} from './useNavigationWithTypes';
import {useClientApi} from '@comapeo/core-react';

export function useListenToInviteCancel(inviteId: string) {
  const navigation = useNavigationFromRoot();
  const {invite: mapeoApiInvite} = useClientApi();
  useEffect(() => {
    function navigateOnCancel(invite: Invite) {
      if (invite.inviteId !== inviteId) return;

      if (invite.state === 'canceled') {
        navigation.replace('InviteCancelled', {
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
