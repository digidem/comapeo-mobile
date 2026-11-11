import * as React from 'react';
import {useLinkingURL} from 'expo-linking';
import {parseInviteUrl} from '../../lib/deepLinkConfig';
import {isInviteScreen, isEditingScreen} from '../../lib/screenNameChecks';

export const DeepLinkListener = ({
  currentRouteName,
  navigateToInviteScreen,
}: {
  currentRouteName: string | undefined;
  navigateToInviteScreen: (inviteId: string) => void;
}) => {
  const url = useLinkingURL();
  const pendingInviteId = url ? parseInviteUrl(url) : null;

  React.useEffect(() => {
    if (!pendingInviteId || !currentRouteName) return;
    if (isInviteScreen(currentRouteName)) return;
    if (isEditingScreen(currentRouteName)) return;
    navigateToInviteScreen(pendingInviteId);
  }, [pendingInviteId, currentRouteName, navigateToInviteScreen]);

  return null;
};
