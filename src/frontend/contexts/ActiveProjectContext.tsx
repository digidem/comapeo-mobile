import * as React from 'react';
import {useSingleProject} from '@comapeo/core-react';
import {type MapeoProjectApi} from '@comapeo/ipc';

const ActiveProjectContext = React.createContext<
  {projectId: string; projectApi: MapeoProjectApi} | undefined
>(undefined);

type Props = {
  activeProjectId: string;
  children: React.ReactNode;
};

export function ActiveProjectProvider({activeProjectId, children}: Props) {
  const {data: projectApi} = useSingleProject({projectId: activeProjectId});

  const dataValue = React.useMemo(
    () => ({projectId: activeProjectId, projectApi}),
    [activeProjectId, projectApi],
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
