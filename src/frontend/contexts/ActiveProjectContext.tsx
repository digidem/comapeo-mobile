import * as React from 'react';
import {useSingleProject} from '@comapeo/core-react';
import {type MapeoProjectApi} from '@comapeo/ipc';
import {Loading} from '../sharedComponents/Loading';

const ActiveProjectContext = React.createContext<
  {projectId: string; projectApi: MapeoProjectApi} | undefined
>(undefined);

type Props = {
  activeProjectId: string;
  children: React.ReactNode;
};

export function ActiveProjectProvider({activeProjectId, children}: Props) {
  return (
    <React.Suspense fallback={<Loading />}>
      <ProjectApiLoader projectId={activeProjectId}>
        {children}
      </ProjectApiLoader>
    </React.Suspense>
  );
}

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
