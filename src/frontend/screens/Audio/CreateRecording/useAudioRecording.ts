import {useState} from 'react';
import {Audio} from 'expo-av';

export function useAudioRecording() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [uri, setUri] = useState<string | null>('');

  console.log(status);

  async function startRecording() {
    const {recording: audioRecording} = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      stat => setStatus(stat),
    );
    setCreatedAt(Date.now());
    setRecording(audioRecording);
  }

  const reset = async () => {
    if (recording) {
      if ((await recording.getStatusAsync()).isRecording) {
        await recording.stopAndUnloadAsync();
      }
    }
    setRecording(null);
    setStatus(null);
    setCreatedAt(null);
    setUri(null);
  };

  async function stopRecording() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    setUri(recording.getURI());
  }

  return {reset, startRecording, stopRecording, status, createdAt, uri};
}
