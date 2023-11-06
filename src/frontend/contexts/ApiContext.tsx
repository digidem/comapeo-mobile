import * as React from 'react';

import {type createMapeoClient} from '@mapeo/ipc';

// TODO: export type from @mapeo/ipc
export type MapeoApi = ReturnType<typeof createMapeoClient>;

// TODO: support passing api mock for unit tests
const ApiContext = React.createContext<MapeoApi | undefined>(undefined);

export type ApiProviderProps = {
  api: MapeoApi;
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
