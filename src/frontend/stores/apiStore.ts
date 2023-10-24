import {closeMapeoClient, createMapeoClient} from '@mapeo/ipc';
import {create} from 'zustand';

import {MessagePortLike} from '../lib/MessagePortLike';

interface ApiStore {
  api: ReturnType<typeof createMapeoClient>;
  status: 'ready' | 'closed';
  actions: {
    enable: () => void;
    disable: () => void;
  };
}

const useApiStore = create<ApiStore>()((set, get) => {
  const channel = new MessagePortLike();

  return {
    api: createMapeoClient(channel),
    status: 'closed',
    actions: {
      enable: () => {
        if (get().status === 'closed') {
          set({
            status: 'ready',
            api: createMapeoClient(channel),
          });
        }
        channel.start();
        console.log('API READY');
      },
      disable: () => {
        const {api, status} = get();

        if (status === 'closed') return;

        closeMapeoClient(api);
        channel.close();
        set({status: 'closed'});
        console.log('API CLOSED');
      },
    },
  };
});

export function useApi() {
  return useApiStore(({api}) => api);
}

export function useApiActions() {
  return useApiStore(({actions}) => actions);
}

export function useApiStatus() {
  return useApiStore(({status}) => status);
}
