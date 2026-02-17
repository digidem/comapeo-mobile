import {type MapeoClientApi} from '@comapeo/ipc';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {ClientApiProvider} from '@comapeo/core-react';
import {ReactNode} from 'react';

export const MapeoApiWrapper = ({
  mapeoApi,
  children,
}: {
  mapeoApi: MapeoClientApi;
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

  return (
    <QueryClientProvider client={queryClient}>
      <ClientApiProvider clientApi={mapeoApi}>{children}</ClientApiProvider>
    </QueryClientProvider>
  );
};
