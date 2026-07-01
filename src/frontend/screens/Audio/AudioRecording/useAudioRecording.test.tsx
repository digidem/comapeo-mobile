import {renderHook, act} from '@testing-library/react-native';
import {useAudioRecorder, useAudioRecorderState} from 'expo-audio';

import {useAudioRecording} from './useAudioRecording';

const mockedUseAudioRecorder = jest.mocked(useAudioRecorder);
const mockedUseAudioRecorderState = jest.mocked(useAudioRecorderState);

type DeferredRecorder = {
  recorder: {
    prepareToRecordAsync: jest.Mock;
    record: jest.Mock;
    stop: jest.Mock;
    uri: string | null;
  };
  resolvePrepare: () => void;
};

function mockRecorderWithPendingPrepare(): DeferredRecorder {
  let resolvePrepare!: () => void;
  const prepareToRecordAsync = jest.fn(
    () =>
      new Promise<void>(resolve => {
        resolvePrepare = resolve;
      }),
  );
  const recorder = {
    prepareToRecordAsync,
    record: jest.fn(),
    stop: jest.fn(() => Promise.resolve()),
    uri: null,
  };
  // @ts-expect-error Partial mock is enough for these tests
  mockedUseAudioRecorder.mockReturnValue(recorder);
  // @ts-expect-error Partial mock is enough for these tests
  mockedUseAudioRecorderState.mockReturnValue({
    isRecording: false,
    durationMillis: 0,
  });
  return {recorder, resolvePrepare: () => resolvePrepare()};
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('useAudioRecording', () => {
  // Regression test for Sentry COMAPEO-1Z7. Leaving the recording screen before
  // prepareToRecordAsync resolves (e.g. starting then stopping/leaving in quick
  // succession) unmounts the hook, which releases the recorder's native shared
  // object. record() then ran against the released object and crashed with
  // "Cannot use shared object that was already released".
  test('does not call record() when unmounted before prepareToRecordAsync resolves', async () => {
    const {recorder, resolvePrepare} = mockRecorderWithPendingPrepare();

    const {result, unmount} = renderHook(() => useAudioRecording());

    let startRecordingPromise!: Promise<void>;
    act(() => {
      startRecordingPromise = result.current.startRecording();
    });

    expect(recorder.prepareToRecordAsync).toHaveBeenCalledTimes(1);
    expect(recorder.record).not.toHaveBeenCalled();

    // Simulate navigating away from the screen while prepare is still pending.
    unmount();

    await act(async () => {
      resolvePrepare();
      await startRecordingPromise;
    });

    expect(recorder.record).not.toHaveBeenCalled();
  });

  test('calls record() when still mounted after prepareToRecordAsync resolves', async () => {
    const {recorder, resolvePrepare} = mockRecorderWithPendingPrepare();

    const {result} = renderHook(() => useAudioRecording());

    let startRecordingPromise!: Promise<void>;
    act(() => {
      startRecordingPromise = result.current.startRecording();
    });

    await act(async () => {
      resolvePrepare();
      await startRecordingPromise;
    });

    expect(recorder.record).toHaveBeenCalledTimes(1);
  });
});
