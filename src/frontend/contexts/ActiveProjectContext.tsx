import * as React from 'react';
import {useClientApi} from '@comapeo/core-react';
import {type MapeoProjectApi} from '@comapeo/ipc';
import {useCreateProject} from '@comapeo/core-react';

import {useSingleProject} from '@comapeo/core-react';
import {Loading} from '../sharedComponents/Loading';
import {
  useActiveProjectIdActions,
  useActiveProjectId,
} from './ActiveProjectIdStoreContext';

const ActiveProjectContext = React.createContext<
  {projectId: string; projectApi: MapeoProjectApi} | undefined
>(undefined);

export const ActiveProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mapeoApi = useClientApi();

  const activeProjectId = useActiveProjectId();
  const {setActiveProjectId} = useActiveProjectIdActions();

  const {mutate: createProject} = useCreateProject();

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

  if (!activeProjectId) {
    return <Loading />;
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <ProjectApiLoader projectId={activeProjectId}>
        {children}
      </ProjectApiLoader>
    </React.Suspense>
  );
};

function ProjectApiLoader({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const {data: projectApi} = useSingleProject({projectId});
  const dataValue = React.useMemo(
    () => ({projectId, projectApi}),
    [projectId, projectApi],
  );

  return (
    <ActiveProjectContext.Provider value={dataValue}>
      {children}
    </ActiveProjectContext.Provider>
  );
}

export function useActiveProject() {
  const projectContext = React.useContext(ActiveProjectContext);
  if (!projectContext) {
    throw new Error('Undefined project context, use ActiveProjectProvider');
  }
  return projectContext;
}
