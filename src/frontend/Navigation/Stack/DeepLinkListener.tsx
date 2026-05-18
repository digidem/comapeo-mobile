import * as React from 'react';
import * as ExpoLinking from 'expo-linking';
import {parseInviteUrl} from '../../lib/deepLinkConfig';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

export const DeepLinkListener = () => {
  const navigation = useNavigationFromRoot();
  const url = ExpoLinking.useURL();
  const [pendingInviteId, setPendingInviteId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (!url) return;
    const inviteId = parseInviteUrl(url);
    if (inviteId) {
      setPendingInviteId(inviteId);
    }
  }, [url]);

  React.useEffect(() => {
    if (!pendingInviteId) return;
    const waitUntilMount = requestAnimationFrame(() => {
      navigation.navigate('InviteReceived', {inviteId: pendingInviteId});
      setPendingInviteId(null);
    });
    return () => cancelAnimationFrame(waitUntilMount);
  }, [pendingInviteId, navigation]);

  return null;
};
