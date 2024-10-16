import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';

export function CreateRecording({isEditing = false}: {isEditing: boolean}) {
  const {startRecording, stopRecording, reset, status, uri} =
    useAudioRecording();

  const recordingState = status?.isRecording ? 'active' : uri ? 'done' : 'idle';

  useEffect(() => {
    if (recordingState === 'active' || recordingState === 'done') {
      const onBackPress = () => {
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => {
        backHandler.remove();
      };
    }
  }, [recordingState]);

  if (recordingState === 'idle') {
    return <RecordingIdle onPressRecord={startRecording} />;
  }

  if (recordingState === 'active') {
    return (
      <RecordingActive
        duration={status?.durationMillis || 0}
        onPressStop={stopRecording}
      />
    );
  }

  if (recordingState === 'done') {
    return (
      <RecordingDone
        uri={uri || ''}
        duration={status?.durationMillis || 0}
        reset={reset}
        isEditing={isEditing}
      />
    );
  }
}
