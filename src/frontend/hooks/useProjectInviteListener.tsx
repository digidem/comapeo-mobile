import {useCallback, useEffect, useState} from 'react';
import {useApi} from '../contexts/ApiContext';
import {EDITING_SCREEN_NAMES} from '../constants';

export type Invite = {
  projectId: string;
  projectName?: string;
  peerId: string;
};

export type InviteWithTimeStamp = Invite & {time: number};

export const useProjectInviteListener = (currentRoute?: string) => {
  const mapeoApi = useApi();
  const [invites, setInvites] = useState<InviteWithTimeStamp[]>([]);

  const clearInvite = useCallback(
    (inviteProjectId: string) => {
      setInvites(invites.filter(inv => inv.projectId !== inviteProjectId));
    },
    [invites],
  );

  const clearAllInvites = () => {
    setInvites([]);
  };

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

  return {
    projectInvites: !EDITING_SCREEN_NAMES.find(val => val === currentRoute)
      ? invites
      : [],
    clearInvite,
    clearAllInvites,
  };
};
