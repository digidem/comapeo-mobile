import {setLongTimeout, clearLongTimeout} from './longTimeout';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

describe('long timeouts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throws if passed a negative delay, and does not call the function', () => {
    const fn = jest.fn();

    expect(() => {
      setLongTimeout(fn, -1);
    }).toThrow();

    expect(fn).not.toHaveBeenCalled();
  });

  it('behaves like setTimeout if called with a 0 delay', () => {
    const fn = jest.fn();

    setLongTimeout(fn, 0);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalled();
  });

  it('behaves like setTimeout if called with a small delay', () => {
    const fn = jest.fn();

    setLongTimeout(fn, 123);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(123);
    expect(fn).toHaveBeenCalled();
  });

  it('can delay for 365 days', () => {
    const fn = jest.fn();

    setLongTimeout(fn, DAY * 365);

    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(DAY * 364);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(DAY);
    expect(fn).toHaveBeenCalled();
  });

  it('can clear short timeouts', () => {
    const fn = jest.fn();
    const timeout = setLongTimeout(fn, 123);

    clearLongTimeout(timeout);

    jest.runAllTimers();
    expect(fn).not.toHaveBeenCalled();
  });

  it('can clear long timeouts', () => {
    const fn = jest.fn();
    const timeout = setLongTimeout(fn, DAY * 365);

    jest.advanceTimersByTime(DAY * 300);
    clearLongTimeout(timeout);

    jest.runAllTimers();
    expect(fn).not.toHaveBeenCalled();
  });

  it('does nothing when clearing a completed timeout', () => {
    const fn = jest.fn();
    const timeout = setLongTimeout(fn, DAY * 365);
    jest.runAllTimers();

    expect(() => {
      clearLongTimeout(timeout);
      clearLongTimeout(timeout);
      clearLongTimeout(timeout);
    }).not.toThrow();
  });

  it('clearing a timeout multiple times is redundant', () => {
    const fn = jest.fn();
    const timeout = setLongTimeout(fn, DAY * 365);

    expect(() => {
      clearLongTimeout(timeout);
      clearLongTimeout(timeout);
      clearLongTimeout(timeout);
    }).not.toThrow();

    jest.runAllTimers();
    expect(fn).not.toHaveBeenCalled();
  });
});
