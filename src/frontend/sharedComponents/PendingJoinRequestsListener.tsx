import * as React from 'react';
import {useJoinRequestReceived} from '../hooks/useInviteLinks';
import {isEditingScreen, isInviteScreen} from '../lib/screenNameChecks';
import type {
  JoinRequestArrival,
  ReceivedJoinRequest,
} from '../hooks/useInviteLinks';

export const PendingJoinRequestsListener = ({
  currentRouteName,
  navigateToJoinRequestScreen,
}: {
  currentRouteName: string | undefined;
  navigateToJoinRequestScreen: (request: ReceivedJoinRequest) => void;
}) => {
  const inviteArrival = useJoinRequestReceived();
  const handled = React.useRef<JoinRequestArrival | null>(null);

  React.useEffect(() => {
    if (
      !inviteArrival ||
      inviteArrival === handled.current ||
      !currentRouteName
    )
      return;
    if (isInviteScreen(currentRouteName)) return;
    if (isEditingScreen(currentRouteName)) return;

    handled.current = inviteArrival;
    navigateToJoinRequestScreen(inviteArrival.request);
  }, [inviteArrival, currentRouteName, navigateToJoinRequestScreen]);

  return null;
};
