import * as React from 'react';
import {useClientApi} from '@comapeo/core-react';

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
