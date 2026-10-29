import * as React from 'react';
import {useClientApi} from '@comapeo/core-react';

/** What core tells us when someone redeems one of our invite links. */
export type ReceivedJoinRequest = {
  projectId: string;
  deviceId: string;
  inviteId: string;
  deviceName: string;
};

/**
 * Wrapped so two requests from the same device are separate arrivals, and so a
 * handled one cannot reopen itself when the route changes.
 */
export type JoinRequestArrival = {request: ReceivedJoinRequest};

export function useJoinRequestReceived(): JoinRequestArrival | null {
  const clientApi = useClientApi();
  const [arrival, setArrival] = React.useState<JoinRequestArrival | null>(null);

  React.useEffect(() => {
    function onJoinRequest(
      projectId: string,
      deviceId: string,
      inviteId: string,
      deviceName: string,
    ) {
      setArrival({request: {projectId, deviceId, inviteId, deviceName}});
    }

    clientApi.on('invite-link-join-request', onJoinRequest);
    return () => {
      clientApi.off('invite-link-join-request', onJoinRequest);
    };
  }, [clientApi]);

  return arrival;
}

/** What core tells us when an incoming redeem of one of our links fails. */
export type FailedJoinRequest = {
  error: Error;
  deviceId: string;
  inviteId: string;
};

/**
 * Wrapped so two failures from the same device are separate arrivals, and so a
 * handled one cannot resurface when the route changes.
 */
export type FailedJoinRequestArrival = {failure: FailedJoinRequest};

/**
 * A redeem that never became a reviewable request. Without this the coordinator
 * gets no feedback at all — core disconnects the peer and the invitee is left
 * waiting on a request that was never shown to anyone.
 */
export function useJoinRequestFailed(): FailedJoinRequestArrival | null {
  const clientApi = useClientApi();
  const [arrival, setArrival] = React.useState<FailedJoinRequestArrival | null>(
    null,
  );

  React.useEffect(() => {
    function onFailed(error: Error, deviceId: string, inviteId: string) {
      setArrival({failure: {error, deviceId, inviteId}});
    }

    clientApi.on('invite-link-join-request-error', onFailed);
    return () => {
      clientApi.off('invite-link-join-request-error', onFailed);
    };
  }, [clientApi]);

  return arrival;
}
