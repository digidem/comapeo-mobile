import * as React from 'react';
import {ObservationProvider} from './ObservationsContext';
import {ProjectDriver} from '../../../backend/mapeo-core/drivers';
import {useProjectQuery} from '../../hooks/server/useProjectQuery';
import {Loading} from '../../sharedComponents/Loading';
import {usePersistedNavigation} from '../../hooks/persistedState/usePersistedNavigation';

const ProjectContext = React.createContext<ProjectDriver | undefined>(
  undefined,
);

export const useProjectContext = () => {
  const context = React.useContext(ProjectContext);

  if (!context) {
    throw new Error(
      'Cannot use project context without initializing a project first (in AppLoading.tsx)',
    );
  }

  return context;
};

export const ProjectProvider = ({children}: {children: React.ReactNode}) => {
  const persistedProjectId = usePersistedNavigation(store => store.projectId);
  const project = useProjectQuery(persistedProjectId);

  if (project.data) {
    return (
      <ProjectContext.Provider value={project.data}>
        <ObservationProvider>{children}</ObservationProvider>
      </ProjectContext.Provider>
    );
  }

  <Loading />;
};
