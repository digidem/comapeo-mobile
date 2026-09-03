import {type ComapeoCoreClientApi} from '@comapeo/ipc';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {ComapeoCoreProvider} from '@comapeo/core-react';
import {ReactNode} from 'react';

export const MapeoApiWrapper = ({
  mapeoApi,
  children,
}: {
  mapeoApi: ComapeoCoreClientApi;
  children: ReactNode;
}) => {
  const queryClient = new QueryClient({
    // Disable garbage collection, so that no "collect garbage" timers are
    // started, which would otherwise leave an open handle, giving a Jest
    // warning. See [this tip in the Tanstack Query docs][0] and [this cache
    // example scenario][1].
    // [0]: https://tanstack.com/query/latest/docs/framework/react/guides/testing#set-gctime-to-infinity-with-jest
    // [1]: https://tanstack.com/query/latest/docs/framework/react/guides/caching
    defaultOptions: {
      queries: {gcTime: Infinity},
      mutations: {gcTime: Infinity},
    },
  });

  // Mock map server API for tests
  const getMapServerBaseUrl = async () => new URL('http://localhost:8080');
  const mockFetch = async () => ({}) as Response;

  return (
    <QueryClientProvider client={queryClient}>
      <ComapeoCoreProvider
        clientApi={mapeoApi}
        getMapServerBaseUrl={getMapServerBaseUrl}
        fetch={mockFetch}
        queryClient={queryClient}>
        {children}
      </ComapeoCoreProvider>
    </QueryClientProvider>
  );
};
