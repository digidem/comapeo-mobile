import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../../hooks/useDraftObservation';

export function useAudioRecording() {
  const [recordingInstance, setRecordingInstance] =
    useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const {navigate} = useNavigationFromRoot();
  const {addAudio} = useDraftObservation();

  const reset = useCallback(async () => {
    try {
      if (recordingInstance) {
        await recordingInstance.stopAndUnloadAsync();
      }
    } finally {
      setRecordingInstance(null);
      setStatus(null);
    }
  }, [recordingInstance]);

  const startRecording = useCallback(async () => {
    try {
      const {recording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        stat => setStatus(stat),
      );
      setRecordingInstance(recording);
    } catch {
      try {
        // Retry once after short delay — helps avoid timing issues when mic permission was just granted
        await new Promise(res => setTimeout(res, 200));
        const {recording} = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          stat => setStatus(stat),
        );
        setRecordingInstance(recording);
      } catch {
        navigate('ErrorBottomSheet');
      }
    }
  }, [navigate]);

  const stopRecording = useCallback(async () => {
    if (!recordingInstance) throw new Error('No active recording to stop');
    try {
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();
      const duration =
        status?.durationMillis ?? recordingInstance._finalDurationMillis;

      if (!uri || !duration) throw new Error('Missing URI or duration');
      const createdAt = Date.now();

      addAudio({uri, duration, createdAt});
      return {uri, createdAt, duration};
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [addAudio, navigate, recordingInstance, status]);

  return {startRecording, stopRecording, reset, status};
}
