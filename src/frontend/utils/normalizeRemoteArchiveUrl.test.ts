import {normalizeRemoteArchiveUrl} from './normalizeRemoteArchiveUrl';

describe('normalizeRemoteArchiveUrl', () => {
  const validTestCases = [
    ['example.com/path', 'https://example.com/path/'],
    ['example.com/path/', 'https://example.com/path/'],
    ['  example.com/path/  ', 'https://example.com/path/'],
    ['https://example.com/path', 'https://example.com/path/'],
    ['https://example.com/path/', 'https://example.com/path/'],
    ['  https://example.com/path/  ', 'https://example.com/path/'],
    ['https://example.com/has spaces', 'https://example.com/has%20spaces/'],
    ['https://example.com/?', 'https://example.com/'],
    ['https://example.com/#', 'https://example.com/'],
    ['HTTPS://example.com', 'https://example.com/'],
    ['HtTpS://example.com', 'https://example.com/'],
    ['例子.网站', 'https://xn--fsqu00a.xn--5tzm5g/'],
    ['https://例子.网站', 'https://xn--fsqu00a.xn--5tzm5g/'],
    ['https:example.com', 'https://example.com/'],
    ['https:/example.com', 'https://example.com/'],
  ];
  const hosts = ['example.com', '0.0.0.0', '127.0.0.1', '100.64.0.42'];
  for (const host of hosts) {
    validTestCases.push([host, `https://${host}/`]);
    validTestCases.push([`https://${host}`, `https://${host}/`]);
    validTestCases.push([`https://${host}:1234`, `https://${host}:1234/`]);
    validTestCases.push([`https://${host}/`, `https://${host}/`]);
  }
  const ipv6Hosts = [
    '::',
    '2001:0db8:0000:0000:0000:0000:0000:0000',
    '0:0:0:0:0:ffff:6440:002a',
  ];
  for (const ip of ipv6Hosts) {
    const {hostname: expectedHostname} = new URL(`http://[${ip}]`);
    validTestCases.push([ip, `https://${expectedHostname}/`]);
    validTestCases.push([`[${ip}]:1234`, `https://${expectedHostname}:1234/`]);
    validTestCases.push([`https://[${ip}]`, `https://${expectedHostname}/`]);
    validTestCases.push([
      `https://[${ip}]:1234`,
      `https://${expectedHostname}:1234/`,
    ]);
  }

  test.each(validTestCases)('%p normalizes to %p', (input, expected) => {
    expect(normalizeRemoteArchiveUrl(input)).toEqual(expected);
  });

  const invalidTestCases = [
    '',
    '  ',
    '.',
    '..',
    'ftp://',
    'http://',
    'https://',
    'https:',
    'https:/',
    'https/',
    'https//',
    'https://https://',
    'https://https://double-protocol.example/',
    'bare-domain',
    'bare-domain:1234',
    'bare-domain/pathname',
    'empty-part.',
    '.empty-part',
    'spaces .in-part',
    'spaces.in part',
    '/just-pathname',
    'https://bare-domain',
    'http://invalid-protocol.example',
    'ftp://invalid-protocol.example',
    'https://has-query-string.example/?foo=bar',
    'https://has-hash.example/#foo',
    'https://user@has-auth.example',
    'https://user:pass@has-auth.example',
    'user:pass@has-auth.example',
    'https/no-colon.example',
    'https//no-colon.example',
    'https://' + 'x'.repeat(2000),
    'https://bad-port:-1.example',
    'https://127.0.0.1:.example',
    'https://127.0.0.1:0.example',
  ];
  test.each(invalidTestCases)('throws on %p', testCase => {
    expect(() => normalizeRemoteArchiveUrl(testCase)).toThrow();
  });
});
