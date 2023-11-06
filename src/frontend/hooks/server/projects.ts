import * as React from 'react';
import {ActiveProjectContext} from '../../contexts/ProjectContext';

export function useUpdateActiveProjectId() {
  const projectContext = React.useContext(ActiveProjectContext);
  if (!projectContext) {
    throw new Error('Undefined project context, use ProjectProvider');
  }
  return projectContext.switchProject;
}

export function useProject() {
  const projectContext = React.useContext(ActiveProjectContext);
  if (!projectContext) {
    throw new Error('Undefined project context, use ProjectProvider');
  }
  return projectContext.project;
}
