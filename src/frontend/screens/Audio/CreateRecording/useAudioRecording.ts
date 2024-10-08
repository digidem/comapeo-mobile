import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';

export function useAudioRecording() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  function normalizeError(err: unknown): Error {
    if (err instanceof Error) {
      return err;
    }
    if (typeof err === 'string') {
      return new Error(err);
    }
    return new Error('An unknown error occurred');
  }

  const startRecording = useCallback(async () => {
    try {
      const {recording: audioRecording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        stat => setStatus(stat),
      );
      setRecording(audioRecording);
    } catch (err) {
      const error = normalizeError(err);
      setError(error);
    }
  }, [setRecording, setStatus, setError]);

  const reset = useCallback(async () => {
    try {
      if (recording) {
        if ((await recording.getStatusAsync()).isRecording) {
          await recording.stopAndUnloadAsync();
        }
      }
      setRecording(null);
      setStatus(null);
      setUri(null);
    } catch (err) {
      const error = normalizeError(err);
      setError(error);
    }
  }, [recording, setRecording, setStatus, setUri, setError]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      setUri(recording.getURI());
    } catch (err) {
      const error = normalizeError(err);
      setError(error);
    }
  }, [recording, setUri]);

  return {reset, startRecording, stopRecording, status, uri, error, clearError};
}
