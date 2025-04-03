import {Invite} from '@comapeo/core/dist/invite/invite-api';
import {useEffect} from 'react';
import {useNavigationFromRoot} from './useNavigationWithTypes';
import * as Sentry from '@sentry/react-native';
import {useClientApi} from '@comapeo/core-react';

export function useListenToInviteStateUpdate(inviteId: string) {
  const navigation = useNavigationFromRoot();
  const {invite: mapeoApiInvite} = useClientApi();
  useEffect(() => {
    function navigateBasedOnInviteState(invite: Invite) {
      if (invite.inviteId !== inviteId) return;

      if (invite.state === 'canceled') {
        navigation.replace('InviteCancelled', {
          projectName: invite.projectName,
        });
        return;
      }

      if (invite.state === 'error') {
        Sentry.captureException(invite.error);
        navigation.replace('ErrorBottomSheet');
        return;
      }
    }

    mapeoApiInvite.addListener('invite-updated', navigateBasedOnInviteState);

    return () => {
      mapeoApiInvite.removeListener(
        'invite-updated',
        navigateBasedOnInviteState,
      );
    };
  }, [mapeoApiInvite, inviteId, navigation]);
}
