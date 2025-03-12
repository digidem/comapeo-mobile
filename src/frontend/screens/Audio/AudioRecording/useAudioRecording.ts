import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';

export function useAudioRecording() {
  const [recordingPromise, setRecordingPromise] =
    useState<Promise<Audio.Recording> | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const {navigate} = useNavigationFromRoot();

  const reset = useCallback(async () => {
    try {
      if (recordingPromise) {
        const recording = await recordingPromise;
        await recording.stopAndUnloadAsync();
      }
      setRecordingPromise(null);
      setStatus(null);
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [recordingPromise, navigate]);

  const startRecording = useCallback(async () => {
    try {
      const newRecordingPromise = Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        stat => setStatus(stat),
      ).then(({recording}) => {
        return recording;
      });
      setRecordingPromise(newRecordingPromise);
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [navigate]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recordingPromise) return;
      const recording = await recordingPromise;
      await recording.stopAndUnloadAsync();
      return recording.getURI();
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [recordingPromise, navigate]);

  return {reset, startRecording, stopRecording, status};
}
