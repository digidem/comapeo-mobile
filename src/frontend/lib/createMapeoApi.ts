import {createMapeoClient} from '@comapeo/ipc/client.js';
import {getTraceData} from '@sentry/core';
import * as Sentry from '@sentry/react-native';
import {MessagePortLike} from './MessagePortLike.ts';
import type {ServerStateStore} from './ServerStateStore.ts';
import noop from './noop.ts';

export function createMapeoApi({
  serverStateStore,
}: {
  serverStateStore: ServerStateStore;
}) {
  const messagePort = new MessagePortLike({serverStateStore});

  const mapeoApi = createMapeoClient(messagePort, {
    timeout: Infinity,
    onRequestHook: (request, next) => {
      const parentSpan = Sentry.getActiveSpan();
      if (!parentSpan) {
        // Tracing is not enabled (no root span) so we don't need to do anything
        next(request).catch(noop);
        return;
      }
      Sentry.startSpan(
        {
          name: request.method.join('.'),
          op: 'ipc',
        },
        async span => {
          const traceHeaders = getTraceData({span});
          if (traceHeaders) {
            // @ts-expect-error - need to update types in rpc-reflector
            request.metadata = {
              'sentry-trace': traceHeaders['sentry-trace'],
              baggage: traceHeaders['baggage'],
            };
          }
          try {
            await next(request);
            span.setStatus({code: 1, message: 'ok'});
          } catch (error) {
            span.setStatus({code: 2, message: 'internal_error'});
            Sentry.captureException(error);
          }
        },
      );
    },
  });
  messagePort.start();
  return mapeoApi;
}
