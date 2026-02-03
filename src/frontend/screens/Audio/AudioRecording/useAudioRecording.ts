import {useCallback} from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
} from 'expo-audio';

const RECORDING_OPTIONS = RecordingPresets.HIGH_QUALITY!;

export function useAudioRecording() {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const status = useAudioRecorderState(recorder, 100);

  const startRecording = useCallback(async () => {
    try {
      await recorder.prepareToRecordAsync();
    } catch {
      try {
        await recorder.prepareToRecordAsync();
      } catch {
        throw new Error('Failed to prepare recorder');
      }
    }

    recorder.record();
  }, [recorder]);

  const stopRecording = useCallback(async () => {
    try {
      await recorder.stop();
    } catch {
      throw new Error('Failed to stop recorder');
    }

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
