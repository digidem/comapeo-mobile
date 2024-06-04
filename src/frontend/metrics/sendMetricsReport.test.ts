import * as http from 'node:http';
import {buffer} from 'node:stream/consumers';
import {promisify} from 'node:util';
import sendMetricsReport from './sendMetricsReport';

describe('sendMetricsReport', () => {
  let teardowns: Array<() => unknown>;

  beforeEach(() => {
    teardowns = [];
  });

  afterEach(() => Promise.all(teardowns.map(fn => fn())));

  const createTestServer = async (
    requestHandler: http.RequestListener,
  ): Promise<string> => {
    const server = http.createServer(requestHandler);

    const listen = promisify(server.listen.bind(server));
    await listen();

    teardowns.push(async () => {
      const close = promisify(server.close.bind(server));
      await close();
    });

    const address = server.address();
    if (!address || typeof address !== 'object') {
      throw new Error("Test server wasn't listening on an IP socket");
    }

    return `http://[${address.address}]:${address.port}`;
  };

  it('makes a request to the metrics server', async () => {
    let requestCount = 0;
    const serverOrigin = await createTestServer(async (req, res) => {
      const rawBody = await buffer(req);
      const body = JSON.parse(rawBody.toString());

      expect(req.method).toBe('POST');
      expect(req.url).toBe('/metrics');
      expect(req.headers['content-type']).toBe('application/json');
      expect(req.headers['content-length']).toBe(rawBody.byteLength.toString());
      expect(req.headers.authorization).toBe('foo123');
      expect(body).toEqual({data: {foo: 'bar'}});

      res.statusCode = 204;
      res.end();

      requestCount++;
    });

    const metricsUrl = new URL('/metrics', serverOrigin).href;

    await sendMetricsReport({
      metricsUrl,
      metricsApiKey: 'foo123',
      metricsReport: {foo: 'bar'},
      signal: new AbortController().signal,
    });

    expect(requestCount).toBe(1);
  });

  it('rejects if the metrics server gives an error', async () => {
    const metricsUrl = await createTestServer(async (req, res) => {
      res.statusCode = 422;
      res.end('sample failure');
    });

    const promise = sendMetricsReport({
      metricsUrl,
      metricsApiKey: 'foo123',
      metricsReport: {foo: 'bar'},
      signal: new AbortController().signal,
    });
    await expect(promise).rejects.toThrow();
  });
});
