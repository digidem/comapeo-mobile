import nodejs from 'nodejs-mobile-react-native';
import {create} from 'zustand';

import type {Status, StatusMessage} from '../../backend/src/status';

interface ServerStatusStore {
  status: Status;
  actions: {unsubscribe: () => void};
}

const useServerStatusStore = create<ServerStatusStore>()((set, get) => {
  // This is a subscription object but nodejs mobile types are broken
  const subscription = nodejs.channel.addListener(
    'server:status',
    (msg: StatusMessage) => {
      console.log('STATUS RECEIVED', msg);
      const prevStatus = get().status;

      if (prevStatus !== msg.value) {
        set({status: msg.value});
      }
    },
  );

  return {
    status: 'IDLE',
    actions: {
      unsubscribe: () => {
        // @ts-expect-error
        subscription.remove();
      },
    },
  };
});

export function useServerStatus() {
  return useServerStatusStore(({status}) => status);
}

export function useServerStatusActions() {
  return useServerStatusStore(({actions}) => actions);
}
