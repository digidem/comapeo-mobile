import {useCallback} from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
} from 'expo-audio';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../../hooks/useDraftObservation';

const RECORDING_OPTIONS = RecordingPresets.HIGH_QUALITY!;

export function useAudioRecording() {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const status = useAudioRecorderState(recorder, 100);
  const {navigate} = useNavigationFromRoot();
  const {addAudio} = useDraftObservation();

  const startRecording = useCallback(async () => {
    if (!recorder) {
      navigate('ErrorBottomSheet');
      return;
    }

    try {
      await recorder.prepareToRecordAsync();
    } catch {
      try {
        await recorder.prepareToRecordAsync();
      } catch {
        navigate('ErrorBottomSheet');
        return;
      }
    }

    recorder.record();
  }, [recorder, navigate]);

  const stopRecording = useCallback(async () => {
    if (!recorder || status.isRecording === false) {
      navigate('ErrorBottomSheet');
      return;
    }

    try {
      await recorder.stop();
    } catch {
      navigate('ErrorBottomSheet');
      return;
    }

    const uri = recorder.uri;
    const duration = status.durationMillis || 0;

    if (!uri || !duration) {
      navigate('ErrorBottomSheet');
      return;
    }

    const createdAt = Date.now();

    addAudio({uri, duration, createdAt});
    return {uri, createdAt, duration};
  }, [recorder, status.isRecording, status.durationMillis, addAudio, navigate]);

  return {startRecording, stopRecording, status};
}
