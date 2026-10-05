import {useEffect} from 'react';
import {useJoinRequestReceived} from '../hooks/useInviteLinks';
import {isEditingScreen, isInviteScreen} from '../lib/screenNameChecks';
import type {JoinRequestDetails} from '../hooks/useInviteLinks';

export const PendingJoinRequestsListener = ({
  currentRouteName,
  navigateToJoinRequestScreen,
}: {
  currentRouteName: string | undefined;
  navigateToJoinRequestScreen: (request: JoinRequestDetails) => void;
}) => {
  const joinRequest = useJoinRequestReceived();

  useEffect(() => {
    if (!joinRequest || !currentRouteName) return;
    if (isInviteScreen(currentRouteName)) return;
    if (isEditingScreen(currentRouteName)) return;

    navigateToJoinRequestScreen(joinRequest);
  }, [joinRequest, currentRouteName, navigateToJoinRequestScreen]);

  return null;
};
