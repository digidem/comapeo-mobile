import {useState, useCallback} from 'react';
import {Audio} from 'expo-av';

export function useAudioRecording() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [uri, setUri] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    const {recording: audioRecording} = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      stat => setStatus(stat),
    );
    setRecording(audioRecording);
  }, [setRecording, setStatus]);

  const reset = useCallback(async () => {
    if (recording) {
      if ((await recording.getStatusAsync()).isRecording) {
        await recording.stopAndUnloadAsync();
      }
    }
    setRecording(null);
    setStatus(null);
    setUri(null);
  }, [recording, setRecording, setStatus, setUri]);

  const stopRecording = useCallback(async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    setUri(recording.getURI());
  }, [recording, setUri]);

  return {reset, startRecording, stopRecording, status, uri};
}
