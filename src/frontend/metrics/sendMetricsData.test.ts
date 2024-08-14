import * as http from 'node:http';
import {buffer} from 'node:stream/consumers';
import {promisify} from 'node:util';
import {sendMetricsData} from './sendMetricsData';

describe('sendMetricsReport', () => {
  let teardowns: Array<() => unknown>;

  beforeEach(() => {
    teardowns = [];
  });

  afterEach(() => Promise.all(teardowns.map(fn => fn())));

  const createTestServer = async (
    requestHandler: http.RequestListener,
  ): Promise<string> => {
    const server = http.createServer(async (req, res) => {
      try {
        await requestHandler(req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(String(err));
      }
    });

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

  it("doesn't send data in development", async () => {
    const serverOrigin = await createTestServer(() => {
      throw new Error('Unexpected request');
    });

    const metricsUrl = new URL('/metrics', serverOrigin).href;

    await sendMetricsData({
      isDevelopment: true,
      metricsUrl,
      metricsApiKey: 'foo123',
      dataToSend: {foo: 'bar'},
    });
  });

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

    await sendMetricsData({
      isDevelopment: false,
      metricsUrl,
      metricsApiKey: 'foo123',
      dataToSend: {foo: 'bar'},
    });

    expect(requestCount).toBe(1);
  });

  it('correctly handles non-ASCII in request body', async () => {
    let requestCount = 0;
    const serverOrigin = await createTestServer(async (req, res) => {
      const rawBody = await buffer(req);
      const body = JSON.parse(rawBody.toString());

      expect(req.headers['content-length']).toBe(rawBody.byteLength.toString());
      expect(body).toEqual({data: {unicode: '👩🏾‍🌾'}});

      res.statusCode = 204;
      res.end();

      requestCount++;
    });

    const metricsUrl = new URL('/metrics', serverOrigin).href;

    await sendMetricsData({
      isDevelopment: false,
      metricsUrl,
      metricsApiKey: 'foo123',
      dataToSend: {unicode: '👩🏾‍🌾'},
    });

    expect(requestCount).toBe(1);
  });

  it('rejects if the metrics server gives an error', async () => {
    const metricsUrl = await createTestServer(async (req, res) => {
      res.statusCode = 422;
      res.end('sample failure');
    });

    const promise = sendMetricsData({
      isDevelopment: false,
      metricsUrl,
      metricsApiKey: 'foo123',
      dataToSend: {foo: 'bar'},
    });
    await expect(promise).rejects.toThrow();
  });
});
