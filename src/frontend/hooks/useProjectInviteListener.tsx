import {useCallback, useEffect, useState} from 'react';
import {useApi} from '../contexts/ApiContext';
import {EDITING_SCREEN_NAMES} from '../constants';

export type Invite = {
  projectId: string;
  projectName?: string;
  peerId: string;
};

type InviteWithTimeStamp = Invite & {time: number};

export const useProjectInviteListener = (currentRoute?: string) => {
  const mapeoApi = useApi();
  const [invites, setInvites] = useState<InviteWithTimeStamp[]>();

  const clearInvite = useCallback(
    (invite?: InviteWithTimeStamp) => {
      if (!invites || !invite) return;
      setInvites(invites.filter(inv => inv.projectId !== invite.projectId));
    },
    [invites],
  );

  useEffect(() => {
    const listenAndSetInvite = (invite: Invite) => {
      setInvites(prev =>
        prev
          ? [...prev, {...invite, time: Date.now()}]
          : [{...invite, time: Date.now()}],
      );
    };

    mapeoApi.invite.addListener('invite-received', listenAndSetInvite);

    return () => {
      mapeoApi.invite.removeListener('invite-received', listenAndSetInvite);
    };
  }, [mapeoApi]);

  const oldestInvite =
    !invites || invites.length < 1
      ? undefined
      : invites.reduce((oldest, current) => {
          return current.time < oldest.time ? current : oldest;
        }, invites[0]);

  const activeOldestInvite = !EDITING_SCREEN_NAMES.find(
    val => val === currentRoute,
  )
    ? oldestInvite
    : undefined;

  return {
    projectInvite: activeOldestInvite,
    clearInvite: () => clearInvite(activeOldestInvite),
  };
};
