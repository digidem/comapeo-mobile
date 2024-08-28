import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {InviteInternal, InviteRemovalReason} from '@mapeo/core/dist/invite-api';
import {MapBuffers} from '@mapeo/core/dist/types';
import {useQueryClient} from '@tanstack/react-query';

import {INVITE_KEY, usePendingInvites} from '../hooks/server/invites';
import {useApi} from './ApiContext';

export type RemovedSessionInvite = {
  status: 'removed';
  invite: MapBuffers<InviteInternal>;
  removalReason: InviteRemovalReason;
};

export type PendingSessionInvite = {
  status: 'pending';
  invite: MapBuffers<InviteInternal>;
};

export type SessionInvite = RemovedSessionInvite | PendingSessionInvite;

const SessionInvitesContext = createContext<Array<SessionInvite>>([]);

export function useSessionInvites() {
  return useContext(SessionInvitesContext);
}

export const SessionInvitesProvider = ({children}: PropsWithChildren<{}>) => {
  useInviteEventsListener();
  const sessionInvites = useDerivedSessionInvites();

  return (
    <SessionInvitesContext.Provider value={sessionInvites}>
      {children}
    </SessionInvitesContext.Provider>
  );
};

function useDerivedSessionInvites(): Array<SessionInvite> {
  const invitesQuery = usePendingInvites();
  const removedInvites = useRemovedInvites();

  const removed = removedInvites.map(({invite, reason}) => ({
    status: 'removed' as const,
    invite,
    removalReason: reason,
  }));

  const pending = (invitesQuery.data || [])
    // Potentially accounts for stale data resulting in an invite being in both pending and removed sources for a short period of time?
    .filter(
      invite =>
        !removedInvites.find(
          removedInvite => removedInvite.invite.inviteId === invite.inviteId,
        ),
    )
    .map(invite => ({
      status: 'pending' as const,
      invite,
    }));

  // Ordered by most recently received
  return [...removed, ...pending].sort((a, b) => {
    return b.invite.receivedAt - a.invite.receivedAt;
  });
}

// Keeps track of invites that have been removed during the current session.
// The server does not provide a way of accessing this history, so this is kept as client state (which is fine since it's session-based).
function useRemovedInvites() {
  const mapeoApi = useApi();

  const [removedInvites, setRemovedInvites] = useState<
    Array<{invite: MapBuffers<InviteInternal>; reason: InviteRemovalReason}>
  >([]);

  useEffect(() => {
    function onInviteRemoved(
      invite: MapBuffers<InviteInternal>,
      reason: InviteRemovalReason,
    ) {
      setRemovedInvites(prev => [...prev, {invite, reason}]);
    }

    mapeoApi.invite.addListener('invite-removed', onInviteRemoved);

    return () => {
      mapeoApi.invite.removeListener('invite-removed', onInviteRemoved);
    };
  }, [mapeoApi, setRemovedInvites]);

  return removedInvites;
}

// Solely responsible for updating the invites query cache when a new invite event is received
function useInviteEventsListener() {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();

  useEffect(() => {
    function onInviteEvent() {
      queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
    }

    mapeoApi.invite.addListener('invite-received', onInviteEvent);
    mapeoApi.invite.addListener('invite-removed', onInviteEvent);

    return () => {
      mapeoApi.invite.removeListener('invite-received', onInviteEvent);
      mapeoApi.invite.removeListener('invite-removed', onInviteEvent);
    };
  }, [mapeoApi, queryClient]);
}
