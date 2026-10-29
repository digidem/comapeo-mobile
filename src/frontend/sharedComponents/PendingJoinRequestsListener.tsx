import * as React from 'react';
import {UnknownInviteIDRedeemAttemptError} from '@comapeo/core/errors.js';
import {
  useJoinRequestFailed,
  useJoinRequestReceived,
} from '../hooks/useInviteLinks';
import {isEditingScreen, isInviteScreen} from '../lib/screenNameChecks';
import {getEventErrorCode} from '../utils/errors';
import type {
  FailedJoinRequestArrival,
  JoinRequestArrival,
  ReceivedJoinRequest,
} from '../hooks/useInviteLinks';

export const PendingJoinRequestsListener = ({
  currentRouteName,
  navigateToJoinRequestScreen,
  navigateToJoinRequestError,
}: {
  currentRouteName: string | undefined;
  navigateToJoinRequestScreen: (request: ReceivedJoinRequest) => void;
  navigateToJoinRequestError: (error: Error) => void;
}) => {
  const inviteArrival = useJoinRequestReceived();
  const failureArrival = useJoinRequestFailed();
  const handled = React.useRef<JoinRequestArrival | null>(null);
  const handledFailure = React.useRef<FailedJoinRequestArrival | null>(null);

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

  React.useEffect(() => {
    if (
      !failureArrival ||
      failureArrival === handledFailure.current ||
      !currentRouteName
    )
      return;
    if (isEditingScreen(currentRouteName)) return;

    handledFailure.current = failureArrival;

    // In the case where someone redeems a link we have already deleted, core denies and
    // disconnects them on its own, so there is nothing for the coordinator to act on and
    // nothing the coordinator did wrong so they should not see an error.
    if (
      getEventErrorCode(failureArrival.failure.error) ===
      UnknownInviteIDRedeemAttemptError.code
    ) {
      return;
    }

    navigateToJoinRequestError(failureArrival.failure.error);
  }, [failureArrival, currentRouteName, navigateToJoinRequestError]);

  return null;
};
