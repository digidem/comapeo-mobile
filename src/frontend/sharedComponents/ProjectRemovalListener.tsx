import * as React from 'react';
import {CommonActions, useNavigationState} from '@react-navigation/native';
import {
  useOwnRoleInProject,
  useProjectOwnRoleChangeListener,
  useSingleProject,
} from '@comapeo/core-react';
import type {RoleChangeEvent} from '@comapeo/core';
import {BLOCKED_ROLE_ID} from '../sharedTypes';
import {useNavigationFromHomeTabs} from '../hooks/useNavigationWithTypes';
import {useActiveProject} from '../contexts/ActiveProjectContext';

export const ProjectRemovalListener = () => {
  const {projectId} = useActiveProject();
  const {
    data: {roleId},
    isRefetching: isRoleRefetching,
  } = useOwnRoleInProject({projectId});

  const navigation = useNavigationFromHomeTabs();
  const routes = useNavigationState(val => val.routes);
  const index = useNavigationState(val => val.index);
  const currentRouteName = routes[index]?.name;

  const dispatchToRemovedProjectBottomSheet = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}, {name: 'RemovedFromProjectBottomSheet'}],
      }),
    );
  }, [navigation]);

  //checks on first open of project that the user has not been blocked
  React.useEffect(() => {
    if (
      roleId === BLOCKED_ROLE_ID &&
      !isRoleRefetching &&
      currentRouteName !== 'RemovedFromProjectBottomSheet'
    ) {
      dispatchToRemovedProjectBottomSheet();
    }
  }, [
    roleId,
    isRoleRefetching,
    dispatchToRemovedProjectBottomSheet,
    currentRouteName,
  ]);

  useProjectOwnRoleChangeListener({projectId});

  const {data: projectApi} = useSingleProject({projectId});

  React.useEffect(() => {
    function handleRoleChange(event: RoleChangeEvent) {
      // Re-dispatching while the bottom sheet is open would remount it,
      // discarding any in-progress leave and re-enabling its button (#1940)
      if (
        event.role.roleId === BLOCKED_ROLE_ID &&
        currentRouteName !== 'RemovedFromProjectBottomSheet'
      ) {
        dispatchToRemovedProjectBottomSheet();
      }
    }

    projectApi.addListener('own-role-change', handleRoleChange);

    return () => {
      projectApi.removeListener('own-role-change', handleRoleChange);
    };
  }, [projectApi, dispatchToRemovedProjectBottomSheet, currentRouteName]);

  return null;
};
