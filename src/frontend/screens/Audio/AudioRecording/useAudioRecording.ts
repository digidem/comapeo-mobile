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
    await recorder.prepareToRecordAsync();

    // If not ready to record after first prepare, try once more
    // This is necessary during enabling of audio permissions
    if (!status.canRecord) {
      await recorder.prepareToRecordAsync();
    }

    recorder.record();
  }, [recorder, status.canRecord]);

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
