import React from 'react';
import {useLocalPeers} from '../../hooks/useLocalPeers';

export function useInitiallyConnectedPeers() {
  const peers = useLocalPeers();
  const [relevantDeviceIds, setRelevantDeviceIds] = React.useState<
    Array<string>
  >(() => {
    return peers.filter(p => p.status === 'connected').map(p => p.deviceId);
  });

  React.useEffect(() => {
    setRelevantDeviceIds(prev => {
      const next = [];

      for (const p of peers) {
        const included = prev.includes(p.deviceId);

        if (included) {
          next.push(p.deviceId);
        } else {
          if (p.status === 'connected') {
            next.push(p.deviceId);
          }
        }
      }

      return next;
    });
  }, [peers, setRelevantDeviceIds]);

  return peers.filter(p => relevantDeviceIds.includes(p.deviceId));
}
