import * as React from 'react';
import {MapeoApi, useApi} from './ApiContext';
import {usePersistedProjectId} from '../hooks/persistedState/usePersistedProjectId';

type MapeoProject = Awaited<ReturnType<MapeoApi['getProject']>>;

type ActiveProjectContext = {
  project: MapeoProject | undefined;
  switchProject(projectId: string): void;
};

export const ActiveProjectContext = React.createContext<
  ActiveProjectContext | undefined
>(undefined);

export const ActiveProjectProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const mapeoApi = useApi();
  const [activeProject, setActiveProject] = React.useState<
    MapeoProject | undefined
  >();
  const activeProjectId = usePersistedProjectId(store => store.projectId);
  const setActiveProjectId = usePersistedProjectId(store => store.setProjectId);

  React.useEffect(() => {
    if (!activeProjectId) return;
    let cancelled = false;
    mapeoApi
      .getProject(activeProjectId)
      .then(project => {
        if (cancelled) return;
        setActiveProject(project);
      })
      .catch(error => {
        if (cancelled) return;

        setActiveProjectId(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [mapeoApi, activeProjectId, setActiveProjectId, setActiveProject]);

  // If no active projectId is set, then either get the first existing project,
  // or if no projects yet exist, create a project
  React.useEffect(() => {
    if (activeProjectId) return;
    let cancelled = false;
    getExistingProjectIdOrCreate(mapeoApi)
      .then(projectId => {
        if (cancelled) return;
        setActiveProjectId(projectId);
      })
      .catch(error => {
        // TODO: Store in state and render error
        console.error(error);
      });
    return () => {
      cancelled = true;
    };
  }, [activeProjectId, setActiveProjectId]);

  const contextValue = React.useMemo<ActiveProjectContext>(() => {
    return {
      project: activeProject,
      switchProject(projectId: string) {
        setActiveProjectId(projectId);
      },
    };
  }, [activeProject, setActiveProjectId]);

  return (
    <ActiveProjectContext.Provider value={contextValue}>
      {children}
    </ActiveProjectContext.Provider>
  );
};

// If we don't have an activeProjectId set, then we use either the first project
// returned by mapeo.listProjects() or we create a new default project
async function getExistingProjectIdOrCreate(mapeoApi: MapeoApi) {
  const projects = await mapeoApi.listProjects();
  // We shouldn't normally get here, except when somehow we end up with an
  // invalid active project id
  if (projects[0]) return projects[0].projectId;
  return mapeoApi.createProject();
}
