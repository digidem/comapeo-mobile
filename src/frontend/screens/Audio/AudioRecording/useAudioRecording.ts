import {useCallback, useEffect, useRef} from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  setAudioModeAsync,
  RecordingPresets,
} from 'expo-audio';

// `directory: 'document'` keeps recordings out of the cache dir, which iOS can
// purge under storage pressure before the draft observation gets saved.
const RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY!,
  directory: 'document' as const,
};

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
    // iOS gates recording on allowsRecording, which defaults to false; without
    // this the native recorder throws as soon as record() is called.
    await setAudioModeAsync({allowsRecording: true, playsInSilentMode: true});
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
