import sleep from './sleep';

type PromiseStatus = 'pending' | 'resolved' | 'rejected';

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('waits a specified number of milliseconds', async () => {
    let isDone = false;
    sleep(100).then(() => {
      isDone = true;
    });

    expect(isDone).toBe(false);

    await jest.advanceTimersByTimeAsync(99);
    expect(isDone).toBe(false);

    await jest.advanceTimersByTimeAsync(1);
    expect(isDone).toBe(true);
  });

  it('can be canceled', async () => {
    const abortController = new AbortController();
    const {signal} = abortController;

    let status: PromiseStatus = 'pending';
    sleep(100, {signal})
      .then(() => {
        status = 'resolved';
      })
      .catch(() => {
        status = 'rejected';
      });

    await jest.advanceTimersByTimeAsync(1);
    expect(status).toBe('pending');

    abortController.abort();
    await jest.advanceTimersByTimeAsync(1);
    expect(status).toBe('rejected');
  });

  it('immediately rejects if signal was already canceled', async () => {
    const abortController = new AbortController();
    const {signal} = abortController;
    abortController.abort();

    let status: PromiseStatus = 'pending';
    sleep(100, {signal})
      .then(() => {
        status = 'resolved';
      })
      .catch(() => {
        status = 'rejected';
      });

    await jest.advanceTimersByTimeAsync(1);
    expect(status).toBe('rejected');
  });
});
