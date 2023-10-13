import * as React from 'react';
import {ObservationProvider} from './ObservationsContext';
import {ProjectDriver} from '../../../backend/mapeo-core/drivers';

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

export const ProjectProvider = ({
  children,
}: {
  rootKey: string;
  secureStoreProjectId: string | null;
  children: React.ReactNode;
}) => {
  return (
    <ProjectContext.Provider value={project}>
      <ObservationProvider>{children}</ObservationProvider>
    </ProjectContext.Provider>
  );
};
