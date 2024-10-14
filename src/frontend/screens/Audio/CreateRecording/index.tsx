import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';
import {ErrorBottomSheet} from '../../../sharedComponents/ErrorBottomSheet';

export function CreateRecording() {
  const {
    startRecording,
    stopRecording,
    reset,
    status,
    uri,
    hasError,
    clearError,
    setHasError,
  } = useAudioRecording();

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

  useEffect(() => {
    if (recordingState === 'done' && !uri) {
      setHasError(true);
    }
  }, [recordingState, uri, setHasError]);

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
        />
      )}
      <ErrorBottomSheet
        error={hasError ? new Error('An error occurred') : null}
        clearError={clearError}
        tryAgain={
          recordingState === 'idle'
            ? startRecording
            : recordingState === 'active'
              ? stopRecording
              : reset
        }
      />
    </>
  );
}
