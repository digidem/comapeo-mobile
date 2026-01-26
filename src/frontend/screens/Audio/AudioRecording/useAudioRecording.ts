import {useState, useCallback} from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
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
    setIsRecording(true);
  }, [recorder, navigate]);

  const stopRecording = useCallback(async () => {
    if (!recorder || !isRecording) {
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
    setIsRecording(false);
    return {uri, createdAt, duration};
  }, [recorder, isRecording, status.durationMillis, addAudio, navigate]);

  return {startRecording, stopRecording, status};
}
