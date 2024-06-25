import {useState} from 'react';
import {Audio} from 'expo-av';
import {unlink} from '../../../lib/file-system';

type AudioRecordingIdle = {status: 'idle'; startRecording: () => Promise<void>};

type AudioRecordingActive = {
  status: 'active';
  /**
   * Time elapsed in milliseconds
   */
  duration: number;
  uri: string;
  stopRecording: () => Promise<void>;
};

type AudioRecordingDone = {
  status: 'done';
  /**
   * Time elapsed in milliseconds
   */
  duration: number;
  uri: string;
  deleteRecording: () => Promise<void>;
};

type AudioRecordingState =
  | AudioRecordingIdle
  | AudioRecordingActive
  | AudioRecordingDone;

export function useAudioRecording(): AudioRecordingState {
  const [state, setState] = useState<{
    recording: Audio.Recording;
    status: Audio.RecordingStatus;
    uri: string;
  } | null>(null);

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

        const uri = recording.getURI();

        // Should not happen
        if (uri === null) {
          throw new Error('Could not get URI for recording');
        }

        setState({recording, status, uri});
      },
    };
  }

  if (state.status.isDoneRecording) {
    return {
      status: 'done',
      duration: state.status.durationMillis,
      uri: state.uri,
      deleteRecording: async () => {
        return unlink(state.uri);
      },
    };
  }

  return {
    status: 'active',
    duration: state.status.durationMillis,
    uri: state.uri,
    stopRecording: async () => {
      const status = await state.recording.stopAndUnloadAsync();

      setState(prev => {
        if (!prev) return prev;
        return {...prev, status};
      });
    },
  };
}
