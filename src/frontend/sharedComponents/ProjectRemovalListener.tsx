import * as React from 'react';
import {CommonActions, useNavigationState} from '@react-navigation/native';
import {
  useOwnRoleInProject,
  useProjectOwnRoleChangeListener,
  useSingleProject,
} from '@comapeo/core-react';
import type {RoleChangeEvent} from '@comapeo/core/dist/mapeo-project';
import {BLOCKED_ROLE_ID} from '../sharedTypes';
import {useNavigationFromHomeTabs} from '../hooks/useNavigationWithTypes';
import {useActiveProject} from '../contexts/ActiveProjectContext';

export const ProjectRemovalListener = () => {
  const {projectId} = useActiveProject();
  const {
    data: {roleId},
  } = useOwnRoleInProject({projectId});

  const navigation = useNavigationFromHomeTabs();
  const routes = useNavigationState(val => val.routes);
  const index = useNavigationState(val => val.index);
  const currentRouteName = routes[index]?.name;

  const dispatchToRemovedProjectBottomSheet = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: 'Home'},
          {
            name: 'RemovedFromProjectBottomSheet',
            params: {projectId},
          },
        ],
      }),
    );
  }, [projectId, navigation]);

  //checks on first open of project that the user has not been blocked
  React.useEffect(() => {
    if (
      roleId === BLOCKED_ROLE_ID &&
      currentRouteName !== 'RemovedFromProjectBottomSheet'
    ) {
      dispatchToRemovedProjectBottomSheet();
    }
  }, [roleId, dispatchToRemovedProjectBottomSheet, currentRouteName]);

  useProjectOwnRoleChangeListener({projectId});

  const {data: projectApi} = useSingleProject({projectId});

  React.useEffect(() => {
    function handleRoleChange(event: RoleChangeEvent) {
      if (event.role.roleId === BLOCKED_ROLE_ID) {
        dispatchToRemovedProjectBottomSheet();
      }
    }

    projectApi.addListener('own-role-change', handleRoleChange);

    return () => {
      projectApi.removeListener('own-role-change', handleRoleChange);
    };
  }, [projectApi, dispatchToRemovedProjectBottomSheet]);

  return null;
};
