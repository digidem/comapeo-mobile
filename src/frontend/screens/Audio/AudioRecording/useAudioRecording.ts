import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';

export function useAudioRecording() {
  const [recordingPromise, setRecordingPromise] =
    useState<Promise<Audio.Recording> | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: unknown) => {
    const newError =
      err instanceof Error ? err : new Error('An unknown error occurred');
    setError(newError);
  }, []);

  const reset = useCallback(async () => {
    try {
      if (recordingPromise) {
        const recording = await recordingPromise;
        await recording.stopAndUnloadAsync();
      }
      setRecordingPromise(null);
      setStatus(null);
      setError(null);
    } catch (err) {
      handleError(err);
    }
  }, [recordingPromise, handleError]);

  const startRecording = useCallback(async () => {
    try {
      const newRecordingPromise = Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        stat => setStatus(stat),
      ).then(({recording}) => {
        return recording;
      });
      setRecordingPromise(newRecordingPromise);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recordingPromise) return;
      const recording = await recordingPromise;
      await recording.stopAndUnloadAsync();
      return recording.getURI();
    } catch (err) {
      handleError(err);
    }
  }, [recordingPromise, handleError]);

  return {reset, startRecording, stopRecording, status, error, setError};
}
