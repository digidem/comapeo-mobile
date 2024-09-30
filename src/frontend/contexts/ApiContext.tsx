import * as React from 'react';
import {type MapeoClientApi} from '@comapeo/ipc';

// TODO: support passing api mock for unit tests
const ApiContext = React.createContext<MapeoClientApi | undefined>(undefined);

export type ApiProviderProps = {
  api: MapeoClientApi;
  children?: React.ReactNode;
};

export const ApiProvider = ({api, children}: ApiProviderProps): JSX.Element => {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export function useApi() {
  const api = React.useContext(ApiContext);
  if (!api) {
    throw new Error('No Api set, use ApiProvider to set one');
  }
  return api;
}
