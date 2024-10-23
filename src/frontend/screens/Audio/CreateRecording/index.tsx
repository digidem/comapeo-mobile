import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';
import {ErrorBottomSheet} from '../../../sharedComponents/ErrorBottomSheet';

export function CreateRecording({isEditing = false}: {isEditing: boolean}) {
  const {startRecording, stopRecording, reset, status, uri, error, setError} =
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

  if (!error && recordingState === 'done' && !uri) {
    setError(new Error('Recording is done, but no URI is available.'));
  }

  return (
    <>
      {recordingState === 'idle' && (
        <RecordingIdle onPressRecord={startRecording} />
      )}
      {recordingState === 'active' && (
        <RecordingActive
          duration={status?.durationMillis || 0}
          onPressStop={stopRecording}
        />
      )}
      {recordingState === 'done' && (
        <RecordingDone
          uri={uri || ''}
          duration={status?.durationMillis || 0}
          reset={reset}
          isEditing={isEditing}
        />
      )}
      <ErrorBottomSheet error={error} clearError={reset} />
    </>
  );
}
