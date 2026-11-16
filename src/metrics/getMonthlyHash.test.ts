import {hexToUint8Array} from 'uint8array-extras';
import {parseISO} from 'date-fns';
import {getMonthlyHash} from './getMonthlyHash';

describe('getMonthlyHash', () => {
  it('returns a hex-encoded buffer with at least 128 bits', async () => {
    const result = await getMonthlyHash('salt', 'abc123', new Date());

    const bytes = hexToUint8Array(result);
    expect(bytes.byteLength).toBeGreaterThanOrEqual(128 / 8);
  });

  it('returns a different hash for different salts', async () => {
    const now = new Date();
    const [a, b] = await Promise.all([
      getMonthlyHash('one', 'abc123', now),
      getMonthlyHash('two', 'abc123', now),
    ]);

    expect(a).not.toEqual(b);
  });

  it('returns a different hash for different metrics device IDs', async () => {
    const now = new Date();
    const [a, b] = await Promise.all([
      getMonthlyHash('salt', 'abc123', now),
      getMonthlyHash('salt', '123abc', now),
    ]);

    expect(a).not.toEqual(b);
  });

  it('returns the same hash on two different days in a month', async () => {
    const day1 = parseISO('2000-06-06T06:06:00Z');
    const day2 = parseISO('2000-06-09T04:20:00Z');
    const [a, b] = await Promise.all([
      getMonthlyHash('salt', 'abc123', day1),
      getMonthlyHash('salt', 'abc123', day2),
    ]);

    expect(a).toEqual(b);
  });

  it('returns different hashes for different months', async () => {
    const day1 = parseISO('2000-10-31T23:59:59Z');
    const day2 = parseISO('2000-11-01T00:00:01Z');
    const day3 = parseISO('2002-10-31T23:59:59Z');
    const [a, b, c] = await Promise.all([
      getMonthlyHash('salt', 'abc123', day1),
      getMonthlyHash('salt', 'abc123', day2),
      getMonthlyHash('salt', 'abc123', day3),
    ]);

    expect(a).not.toEqual(b);
    expect(a).not.toEqual(c);
    expect(b).not.toEqual(c);
  });
});
