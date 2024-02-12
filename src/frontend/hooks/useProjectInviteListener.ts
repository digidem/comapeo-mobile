import {useCallback, useEffect, useState} from 'react';
import {useApi} from '../contexts/ApiContext';
import {EDITING_SCREEN_NAMES} from '../constants';
import {useNavigationState} from '@react-navigation/native';

export type Invite = {
  projectId: string;
  projectName?: string;
  peerId: string;
};

export type InviteWithTimeStamp = Invite & {time: number};

/**
 *
 * @description Used to listen for any invites that may be recieved in the background. Returns an array of invites, as the user may recieve more than one. Should be used at the root of the app. If the user is on a navigation route that involves editting (eg. creating an observation), it will return an empty array, and will wait until the user has completed any editting before returning the invites.
 */
export const useProjectInviteListener = () => {
  const mapeoApi = useApi();
  const routes = useNavigationState(state => (!state ? [] : state.routes));
  const index = useNavigationState(state => (!state ? undefined : state.index));
  const [invites, setInvites] = useState<InviteWithTimeStamp[]>([]);

  const parentRoute = routes[index || 0];

  const routeName = !parentRoute
    ? undefined
    : !parentRoute.state
      ? parentRoute.name
      : parentRoute.state.routes[parentRoute.state.index || 0].name;

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
    projectInvites: !EDITING_SCREEN_NAMES.find(val => val === routeName)
      ? invites
      : [],
    clearInvite,
    clearAllInvites,
  };
};
