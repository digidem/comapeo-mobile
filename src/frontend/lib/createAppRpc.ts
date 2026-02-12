import {createAppRpcClient} from '@comapeo/ipc/client.js';
import {MessagePortLike} from './MessagePortLike.ts';
import type {ServerStateStore} from './ServerStateStore.ts';

export function createAppRpc({
  serverStateStore,
}: {
  serverStateStore: ServerStateStore;
}) {
  const messagePort = new MessagePortLike({serverStateStore});
  const appRpc = createAppRpcClient(messagePort, {timeout: Infinity});
  messagePort.start();
  return appRpc;
}
