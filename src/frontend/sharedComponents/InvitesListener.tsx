import {useManyInvites} from '@comapeo/core-react';
import {useEffect} from 'react';
import {isEditingScreen} from '../lib/isEditingScreen';

export const InvitesListener = ({
  currentRouteName,
  navigateToInviteScreen,
}: {
  currentRouteName: string | undefined;
  navigateToInviteScreen: (inviteId: string) => void;
}) => {
  const {data: invites} = useManyInvites();

  useEffect(() => {
    const invite = invites.find(i => i.state === 'pending');
    if (invite && currentRouteName && !isEditingScreen(currentRouteName)) {
      navigateToInviteScreen(invite.inviteId);
    }
  }, [invites, currentRouteName, navigateToInviteScreen]);
  return null;
};
