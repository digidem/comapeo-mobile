import {assert} from '../lib/assert';
import {isIPv4, isIPv6} from '../lib/ipAddress';

function parseUrl(userInput: string): URL {
  userInput = userInput.trim();

  if (isIPv6(userInput)) {
    return new URL('https://[' + userInput + ']');
  }

  try {
    return new URL(userInput);
  } catch (_err) {
    /* ignored */
  }

  return new URL('https://' + userInput);
}

function isHostnameIpAddress(hostname: string): boolean {
  if (isIPv4(hostname)) return true;

  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    return isIPv6(hostname.slice(1, -1));
  }

  return false;
}

/**
 * Makes sure the string is an HTTPS URL that ends in a slash.
 *
 * Throws if the URL is invalid. It can be invalid because it's malformed,
 * has a non-HTTPS protocol, has authentication, has a query string, has a
 * hash, or is a "bare" domain.
 *
 * @example
 * normalizeRemoteArchiveUrl("example.com")
 * // => "https://example.com/"
 *
 * normalizeRemoteArchiveUrl("100.64.0.42:1234")
 * // => "https://100.64.0.42:1234/"
 *
 * normalizeRemoteArchiveUrl("https://example.com/path")
 * // => "https://example.com/path/"
 *
 * normalizeRemoteArchiveUrl("http://incorrect-protocol.example")
 * // Error
 */
export function normalizeRemoteArchiveUrl(userInput: string): string {
  // Avoid performance issues from very long inputs.
  assert(userInput.length < 2000, 'server URL is too long');

  const url = parseUrl(userInput);

  assert(url.protocol === 'https:', 'server URL must use HTTPS');
  assert(
    !url.username && !url.password,
    'server URL must not have authentication',
  );
  assert(!url.search, 'server URL must not have a query string');
  assert(!url.hash, 'server URL must not have a hash');

  if (!isHostnameIpAddress(url.hostname)) {
    const parts = url.hostname.split('.');
    assert(parts.length >= 2, 'server URL domains must have at least 2 parts');
    assert(parts.every(Boolean), 'server URL must not have empty parts');
  }

  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';

  return url.href;
}
