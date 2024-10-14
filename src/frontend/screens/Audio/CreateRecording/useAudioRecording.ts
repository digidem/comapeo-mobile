import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';

export function useAudioRecording() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const clearError = useCallback(() => setHasError(false), []);

  const startRecording = useCallback(async () => {
    try {
      const {recording: audioRecording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        stat => setStatus(stat),
      );
      setRecording(audioRecording);
      setHasError(false);
    } catch (err) {
      setHasError(true);
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      if (recording && (await recording.getStatusAsync()).isRecording) {
        await recording.stopAndUnloadAsync();
      }
      setRecording(null);
      setStatus(null);
      setUri(null);
      setHasError(false);
    } catch {
      setHasError(true);
    }
  }, [recording]);

  const stopRecording = useCallback(async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      setUri(recording.getURI());
      setHasError(false);
    } catch {
      setHasError(true);
    }
  }, [recording]);

  return {
    reset,
    startRecording,
    stopRecording,
    status,
    uri,
    hasError,
    clearError,
  };
}
