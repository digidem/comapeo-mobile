import * as React from 'react';
import {useLinkingURL} from 'expo-linking';
import {parseInviteLink} from '../../lib/inviteLinks';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {isInviteScreen, isEditingScreen} from '../../lib/screenNameChecks';

export const DeepLinkListener = ({
  currentRouteName,
}: {
  currentRouteName: string | undefined;
}) => {
  const navigation = useNavigationFromRoot();
  const url = useLinkingURL();

  React.useEffect(() => {
    if (!url || !currentRouteName) return;
    if (isInviteScreen(currentRouteName)) return;
    if (isEditingScreen(currentRouteName)) return;

    const invite = parseInviteLink(url);
    if (!invite) return;

    navigation.navigate('RequestToJoin', invite);
  }, [url, currentRouteName, navigation]);

  return null;
};
