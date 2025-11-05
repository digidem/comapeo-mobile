import * as React from 'react';
import {
  CommonActions,
  type NavigationContainerRef,
} from '@react-navigation/native';
import {
  useManyProjects,
  useProjectOwnRoleChangeListener,
  useProjectSettings,
} from '@comapeo/core-react';
import type {RoleChangeEvent} from '@comapeo/core/dist/mapeo-project';
import {
  useActiveProjectId,
  useActiveProjectIdActions,
} from '../contexts/ActiveProjectIdStoreContext';
import {BLOCKED_ROLE_ID} from '../sharedTypes';
import type {AppStackParamsList} from '../sharedTypes/navigation';

export const ProjectRemovalListener = ({
  navigationRef,
}: {
  navigationRef: React.RefObject<NavigationContainerRef<AppStackParamsList> | null>;
}) => {
  const activeProjectId = useActiveProjectId();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const {data: projects} = useManyProjects();
  const {data: currentProjectSettings} = useProjectSettings({
    projectId: activeProjectId || '',
  });

  useProjectOwnRoleChangeListener({
    projectId: activeProjectId || '',
    listener: React.useCallback(
      (event: RoleChangeEvent) => {
        if (event.role.roleId === BLOCKED_ROLE_ID) {
          const defaultProject = projects?.find(p => !p.name);

          if (defaultProject) {
            setActiveProjectId(defaultProject.projectId);

            navigationRef.current?.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Home'}],
              }),
            );

            setTimeout(() => {
              navigationRef.current?.navigate('RemovedFromProjectBottomSheet', {
                projectName: currentProjectSettings?.name || 'Unknown Project',
                projectColor: currentProjectSettings?.projectColor,
                reason: event.role.reason,
              });
            }, 300);
          }
        }
      },
      [projects, currentProjectSettings, setActiveProjectId, navigationRef],
    ),
  });

  return null;
};
