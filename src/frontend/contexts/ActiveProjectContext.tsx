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
  const {mutate: createProject} = useCreateProject();

  // This guarantees that a project is always mounted in between creation of a new project
  // Otherwise, a new project is created, the cache is reset, activeProjectQuery.data becomes undefined
  // and unmounts the entire navContainer
  React.useEffect(() => {
    if (activeProjectQuery.data) {
      setCurrentProject(activeProjectQuery.data);
    }
  }, [activeProjectQuery.data, setCurrentProject]);

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

  if (!currentProject) {
    return <Loading />;
  }

  return (
    <ActiveProjectContext.Provider value={currentProject}>
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
