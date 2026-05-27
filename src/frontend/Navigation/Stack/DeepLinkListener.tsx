import * as React from 'react';
import {useLinkingURL} from 'expo-linking';
import {parseInviteUrl} from '../../lib/deepLinkConfig';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {isInviteScreen, isEditingScreen} from '../../lib/screenNameChecks';

export const DeepLinkListener = ({
  currentRouteName,
}: {
  currentRouteName: string | undefined;
}) => {
  const navigation = useNavigationFromRoot();
  const url = useLinkingURL();
  const pendingInviteId = url ? parseInviteUrl(url) : null;

  React.useEffect(() => {
    if (!pendingInviteId || !currentRouteName) return;
    if (isInviteScreen(currentRouteName)) return;
    if (isEditingScreen(currentRouteName)) return;
    navigation.navigate('InviteReceived', {inviteId: pendingInviteId});
  }, [pendingInviteId, currentRouteName, navigation]);

  return null;
};
