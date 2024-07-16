import * as React from 'react';
import {type MapeoProjectApi} from '@mapeo/ipc';

import {usePersistedProjectId} from '../hooks/persistedState/usePersistedProjectId';
import {useProject, useCreateProject} from '../hooks/server/projects';
import {Loading} from '../sharedComponents/Loading';
import {useApi} from './ApiContext';

const ActiveProjectContext = React.createContext<MapeoProjectApi | undefined>(
  undefined,
);

export const ActiveProjectProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const mapeoApi = useApi();

  const activeProjectId = usePersistedProjectId(store => store.projectId);
  const setActiveProjectId = usePersistedProjectId(store => store.setProjectId);

  const activeProjectQuery = useProject(activeProjectId);
  const [currentProject, setCurrentProject] = React.useState<MapeoProjectApi>();
  const [previousProject, setPreviousProject] =
    React.useState<MapeoProjectApi>();
  const {mutate: createProject} = useCreateProject();

  // This is not ideal. But in order for the user to never have an undefined project, we need to load the previous project as the current project initially. That way when current project is reset, previous project will have a value to return.
  if (!previousProject && currentProject) {
    setPreviousProject(currentProject);
  }

  React.useEffect(() => {
    if (!activeProjectQuery.isPending && activeProjectQuery.data) {
      setPreviousProject(currentProject);
      setCurrentProject(activeProjectQuery.data);
    }
  }, [
    activeProjectQuery.isPending,
    activeProjectQuery.data,
    setCurrentProject,
    currentProject,
  ]);

  // The persisted active project ID may be missing in the following scenarios:
  //
  // 1. Opening the app for the first time
  // 2. The entry in storage somehow gets deleted
  //
  // In the case of (1), a new "default" project is created
  // In the case of (2), we choose one of the existing projects in the database.
  //
  // How this is currently done is naive for now, but is sufficient until a UI to choose from a list of existing projects is implemented.
  React.useEffect(() => {
    if (activeProjectId) return;

    mapeoApi
      .listProjects()
      .then(projects => {
        // TODO: Be smarter about which project we select if multiple exist in the database
        const chosenActiveProject = projects[0];

        if (chosenActiveProject) {
          setActiveProjectId(chosenActiveProject.projectId);
        } else {
          createProject(undefined, {
            onError: err => {
              // TODO: Surface error in UI
              console.error(err);
            },
            onSuccess: projectId => {
              setActiveProjectId(projectId);
            },
          });
        }
      })
      .catch(err => {
        // TODO: Surface error in UI
        console.error(err);
      });
  }, [activeProjectId, setActiveProjectId, createProject, mapeoApi]);

  if (!currentProject && !previousProject) {
    return <Loading />;
  }

  return (
    <ActiveProjectContext.Provider value={currentProject || previousProject}>
      {children}
    </ActiveProjectContext.Provider>
  );
};

export function useActiveProject() {
  const projectContext = React.useContext(ActiveProjectContext);
  if (!projectContext) {
    throw new Error('Undefined project context, use ActiveProjectProvider');
  }
  return projectContext;
}
