import * as React from 'react';
import {useLinkingURL} from 'expo-linking';
import {parseInviteLink, type InviteLink} from '../../lib/inviteLinks';
import {isInviteScreen, isEditingScreen} from '../../lib/screenNameChecks';

export const DeepLinkListener = ({
  currentRouteName,
  navigateToRequestToJoin,
}: {
  currentRouteName: string | undefined;
  navigateToRequestToJoin: (invite: InviteLink) => void;
}) => {
  const url = useLinkingURL();

  React.useEffect(() => {
    if (!url || !currentRouteName) return;
    if (isInviteScreen(currentRouteName)) return;
    if (isEditingScreen(currentRouteName)) return;

    const invite = parseInviteLink(url);
    if (!invite) return;

    navigateToRequestToJoin(invite);
  }, [url, currentRouteName, navigateToRequestToJoin]);

  return null;
};
