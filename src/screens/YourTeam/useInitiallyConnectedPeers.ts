import React from 'react';
import {useLocalPeers} from '../../hooks/useLocalPeers';

export function useInitiallyConnectedPeers() {
  const peers = useLocalPeers();
  const [relevantDeviceIds, setRelevantDeviceIds] = React.useState<Set<string>>(
    () =>
      new Set(peers.filter(p => p.status === 'connected').map(p => p.deviceId)),
  );

  const nextSeenConnectedIds = new Set(relevantDeviceIds);
  let changed = false;
  for (const p of peers) {
    if (p.status === 'connected' && !nextSeenConnectedIds.has(p.deviceId)) {
      nextSeenConnectedIds.add(p.deviceId);
      changed = true;
    }
  }
  if (changed) {
    setRelevantDeviceIds(nextSeenConnectedIds);
  }

  return peers.filter(p => relevantDeviceIds.has(p.deviceId));
}
