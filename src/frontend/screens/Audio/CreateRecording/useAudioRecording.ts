import {useState} from 'react';
import {Audio} from 'expo-av';
import {unlink} from '../../../lib/file-system';

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
  uri: string;
  createdAt: number;
  stopRecording: () => Promise<void>;
  reset: () => Promise<void>;
};

type AudioRecordingDone = {
  status: 'done';
  /**
   * Time elapsed in milliseconds
   */
  duration: number;
  uri: string;
  createdAt: number;
  deleteRecording: () => Promise<void>;
  reset: () => Promise<void>;
};

type AudioRecordingState =
  | AudioRecordingIdle
  | AudioRecordingActive
  | AudioRecordingDone;

export function useAudioRecording(): AudioRecordingState {
  const [state, setState] = useState<{
    createdAt: number;
    recording: Audio.Recording;
    status: Audio.RecordingStatus;
    uri: string;
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
        const createdAt = Date.now();
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

        const uri = recording.getURI();

        // Should not happen
        if (uri === null) {
          throw new Error('Could not get URI for recording');
        }

        setState({createdAt, recording, status, uri});
      },
      reset,
    };
  }

  if (state.status.isDoneRecording) {
    return {
      status: 'done',
      duration: state.status.durationMillis,
      uri: state.uri,
      createdAt: state.createdAt,
      deleteRecording: async () => {
        return unlink(state.uri);
      },
      reset,
    };
  }

  return {
    status: 'active',
    duration: state.status.durationMillis,
    uri: state.uri,
    createdAt: state.createdAt,
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
