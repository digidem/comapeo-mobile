import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';

export function useAudioRecording() {
  const [recordingInstance, setRecordingInstance] =
    useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const {navigate} = useNavigationFromRoot();

  const startRecording = useCallback(async () => {
    try {
      const {recording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        stat => setStatus(stat),
      );
      setRecordingInstance(recording);
    } catch {
      try {
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

      return {uri, createdAt, duration};
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [navigate, recordingInstance, status]);

  return {startRecording, stopRecording, status};
}
