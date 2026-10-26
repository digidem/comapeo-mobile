import * as React from 'react';
import {useClientApi} from '@comapeo/core-react';
import type {InviteLinkJoiner} from '@comapeo/core';

/** What core tells us when someone redeems one of our invite links. */
export type ReceivedJoinRequest = {
  projectId: string;
  deviceId: string;
  inviteId: string;
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
    ) {
      setArrival({request: {projectId, deviceId, inviteId}});
    }

    clientApi.on('invite-link-join-request', onJoinRequest);
    return () => {
      clientApi.off('invite-link-join-request', onJoinRequest);
    };
  }, [clientApi]);

  return arrival;
}

/**
 * The latest status core has reported for one of our own join requests.
 *
 * core drops a join request from memory as soon as it settles, so
 * `useSingleJoinRequest` can never report `completed` or `failed` — by the time
 * the refetch lands there is nothing left to read. The event carries the
 * status, the resolved projectId and the error, so it is the only source for a
 * terminal state.
 */
export function useJoinRequestUpdate(
  inviteId: string,
): InviteLinkJoiner.JoinRequestUpdate | null {
  const clientApi = useClientApi();
  const [update, setUpdate] =
    React.useState<InviteLinkJoiner.JoinRequestUpdate | null>(null);

  React.useEffect(() => {
    function onUpdate(next: InviteLinkJoiner.JoinRequestUpdate) {
      if (next.inviteId !== inviteId) return;
      setUpdate(next);
    }

    clientApi.inviteLinks.on('join-request-update', onUpdate);
    return () => {
      clientApi.inviteLinks.off('join-request-update', onUpdate);
    };
  }, [clientApi, inviteId]);

  return update;
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
