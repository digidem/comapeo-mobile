import {useManyInvites} from '@comapeo/core-react';
import {useEffect} from 'react';
import {isEditingScreen, isInviteScreen} from '../lib/screenNameChecks';

export const PendingInvitesListener = ({
  currentRouteName,
  navigateToInviteScreen,
}: {
  currentRouteName: string | undefined;
  navigateToInviteScreen: (inviteId: string) => void;
}) => {
  const {data: invites} = useManyInvites();

  useEffect(() => {
    const invite = invites.find(i => i.state === 'pending');
    if (!invite || !currentRouteName) return;

    // if user is already interacting with an invite, do nothing
    if (isInviteScreen(currentRouteName)) return;

    if (isEditingScreen(currentRouteName)) return;

    navigateToInviteScreen(invite.inviteId);
  }, [invites, currentRouteName, navigateToInviteScreen]);
  return null;
};
