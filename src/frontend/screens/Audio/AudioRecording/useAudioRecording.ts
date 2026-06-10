import {useCallback, useEffect, useRef} from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
} from 'expo-audio';

const RECORDING_OPTIONS = RecordingPresets.HIGH_QUALITY!;

export function useAudioRecording() {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const status = useAudioRecorderState(recorder, 100);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const startRecording = useCallback(async () => {
    await recorder.prepareToRecordAsync();
    // expo-audio releases the recorder's native object when this hook unmounts.
    // If the screen unmounts while prepareToRecordAsync is still awaiting,
    // record() would run against a released object and crash (Sentry COMAPEO-1Z7).
    if (!isMountedRef.current) return;
    recorder.record();
  }, [recorder]);

  const stopRecording = useCallback(async () => {
    await recorder.stop();

    const uri = recorder.uri;
    const duration = status.durationMillis;

    if (!uri || !duration) {
      throw new Error('Recording failed. No URI or duration');
    }

    const createdAt = Date.now();

    return {uri, createdAt, duration};
  }, [recorder, status.durationMillis]);

  return {startRecording, stopRecording, status};
}
