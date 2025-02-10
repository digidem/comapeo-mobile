import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';

export function useAudioRecording() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: unknown) => {
    const newError =
      err instanceof Error ? err : new Error('An unknown error occurred');
    setError(newError);
  }, []);

  const reset = useCallback(async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      setRecording(null);
      setStatus(null);
      setError(null);
    } catch (err) {
      handleError(err);
    }
  }, [recording, handleError]);

  const startRecording = useCallback(async () => {
    try {
      const {recording: audioRecording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        stat => setStatus(stat),
      );
      setRecording(audioRecording);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      return recording.getURI();
    } catch (err) {
      handleError(err);
    }
  }, [recording, handleError]);

  return {
    reset,
    startRecording,
    stopRecording,
    status,
    error,
    setError,
  };
}
