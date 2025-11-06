import * as React from 'react';
import {CommonActions, NavigationHelpers} from '@react-navigation/native';
import {
  useOwnRoleInProject,
  useProjectOwnRoleChangeListener,
} from '@comapeo/core-react';
import type {RoleChangeEvent} from '@comapeo/core/dist/mapeo-project';
import {BLOCKED_ROLE_ID} from '../sharedTypes';
import {AppStackParamsList} from '../sharedTypes/navigation';

export const ProjectRemovalListener = ({
  activeProjectId,
  currentRouteName,
  navigation,
}: {
  activeProjectId: string;
  currentRouteName: string | undefined;
  navigation: NavigationHelpers<AppStackParamsList>;
}) => {
  const {
    data: {roleId},
  } = useOwnRoleInProject({projectId: activeProjectId});

  const dispatchToRemovedProjectBottomSheet = React.useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: 'Home'},
          {
            name: 'RemovedFromProjectBottomSheet',
            params: {projectId: activeProjectId},
          },
        ],
      }),
    );
  }, [activeProjectId, navigation]);

  //checks on first open of project that the user has not been blocked
  React.useEffect(() => {
    if (
      roleId === BLOCKED_ROLE_ID &&
      currentRouteName !== 'RemovedFromProjectBottomSheet'
    ) {
      dispatchToRemovedProjectBottomSheet();
    }
  }, [roleId, dispatchToRemovedProjectBottomSheet, currentRouteName]);

  useProjectOwnRoleChangeListener({
    projectId: activeProjectId,
    listener: React.useCallback(
      (event: RoleChangeEvent) => {
        if (event.role.roleId === BLOCKED_ROLE_ID) {
          dispatchToRemovedProjectBottomSheet();
        }
      },
      [dispatchToRemovedProjectBottomSheet],
    ),
  });

  return null;
};
