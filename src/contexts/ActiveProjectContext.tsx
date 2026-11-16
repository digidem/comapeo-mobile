import {type ReactNode, createContext, useContext, useMemo} from 'react';
import {useSingleProject} from '@comapeo/core-react';
import {type ComapeoProjectClientApi} from '@comapeo/ipc';

const ActiveProjectContext = createContext<
  {projectId: string; projectApi: ComapeoProjectClientApi} | undefined
>(undefined);

type Props = {
  activeProjectId: string;
  children: ReactNode;
};

export function ActiveProjectProvider({activeProjectId, children}: Props) {
  const {data: projectApi} = useSingleProject({projectId: activeProjectId});

  const dataValue = useMemo(
    () => ({projectId: activeProjectId, projectApi}),
    [activeProjectId, projectApi],
  );

  return (
    <ActiveProjectContext value={dataValue}>{children}</ActiveProjectContext>
  );
}

export function useActiveProject() {
  const projectContext = useContext(ActiveProjectContext);
  if (!projectContext) {
    throw new Error('Undefined project context, use ActiveProjectProvider');
  }
  return projectContext;
}
