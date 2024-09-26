import {useState} from 'react';
import {Audio} from 'expo-av';

type AudioRecordingIdle = {
  status: 'idle';
  startRecording: () => Promise<void>;
  reset: () => Promise<void>;
};

type AudioRecordingActive = {
  status: 'active';
  /**
   * Time elapsed in milliseconds
   */
  duration: number;
  stopRecording: () => Promise<void>;
  reset: () => Promise<void>;
};

type AudioRecordingState = AudioRecordingIdle | AudioRecordingActive;

export function useAudioRecording(): AudioRecordingState {
  const [state, setState] = useState<{
    recording: Audio.Recording;
    status: Audio.RecordingStatus;
  } | null>(null);

  const reset = async () => {
    if (state) {
      if (state.status.isRecording) {
        await state.recording.stopAndUnloadAsync();
      }
    }
    setState(null);
  };

  if (!state) {
    return {
      status: 'idle',
      startRecording: async () => {
        const {recording, status} = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          status => {
            setState(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                status,
              };
            });
          },
          1000,
        );

        setState({recording, status});
      },
      reset,
    };
  }

  return {
    status: 'active',
    duration: state.status.durationMillis,
    stopRecording: async () => {
      const status = await state.recording.stopAndUnloadAsync();

      setState(prev => {
        if (!prev) return prev;
        return {...prev, status};
      });
    },
    reset,
  };
}
