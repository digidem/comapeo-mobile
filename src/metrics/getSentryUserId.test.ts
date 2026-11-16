import {parseISO} from 'date-fns';
import {getSentryUserId} from './getSentryUserId';

describe('getSentryUserId', () => {
  it('returns a new user ID if storage is empty', () => {
    const result = getSentryUserId({
      now: new Date(),
      storage: new FakeStorage(),
    });
    expect(result.length).toBeGreaterThanOrEqual(10);
  });

  it('keeps the same ID if the previous one is from the same month', () => {
    const storage = new FakeStorage();

    const result1 = getSentryUserId({
      now: parseISO('2000-06-06T06:06:00Z'),
      storage,
    });
    const result2 = getSentryUserId({
      now: parseISO('2000-06-09T04:20:00Z'),
      storage,
    });

    expect(result1).toEqual(result2);
  });

  it('generates a new ID if the previous ID is from a different month', () => {
    const storage = new FakeStorage();

    const result1 = getSentryUserId({
      now: parseISO('2000-06-06T06:06:00Z'),
      storage,
    });
    const result2 = getSentryUserId({
      now: parseISO('2000-07-07T04:20:00Z'),
      storage,
    });
    const result3 = getSentryUserId({
      now: parseISO('2002-07-07T04:20:00Z'),
      storage,
    });

    expect(result1).not.toEqual(result2);
    expect(result2).not.toEqual(result3);
    expect(result1).not.toEqual(result3);
  });
});

class FakeStorage {
  #data = new Map<string, unknown>();

  getString(key: string): undefined | string {
    return this.#data.has(key) ? String(this.#data.get(key)) : undefined;
  }

  set(key: string, value: unknown): void {
    this.#data.set(key, value);
  }
}
