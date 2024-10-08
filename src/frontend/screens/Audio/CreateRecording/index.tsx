import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';
import {ErrorBottomSheet} from '../../../sharedComponents/ErrorBottomSheet';
import {MessageDescriptor} from 'react-intl';

export function CreateRecording() {
  const {startRecording, stopRecording, reset, status, uri, error, clearError} =
    useAudioRecording();

  const currentState = status?.isRecording ? 'active' : uri ? 'done' : 'idle';

  useEffect(() => {
    if (currentState === 'active' || currentState === 'done') {
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
  }, [currentState]);

  return (
    <>
      {currentState === 'idle' && (
        <RecordingIdle onPressRecord={startRecording} />
      )}
      {currentState === 'active' && (
        <RecordingActive
          duration={status?.durationMillis || 0}
          onPressStop={stopRecording}
        />
      )}
      {currentState === 'done' && (
        <RecordingDone
          uri={uri || ''}
          duration={status?.durationMillis || 0}
          reset={reset}
        />
      )}
      <ErrorBottomSheet
        error={error}
        description={
          error?.message
            ? ({
                id: 'error.dynamic',
                defaultMessage: error.message,
              } as MessageDescriptor)
            : undefined
        }
        clearError={clearError}
        tryAgain={
          currentState === 'idle'
            ? startRecording
            : currentState === 'active'
              ? stopRecording
              : reset
        }
      />
    </>
  );
}
