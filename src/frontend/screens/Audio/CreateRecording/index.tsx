import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';

export function CreateRecording() {
  const navigation = useNavigationFromRoot();
  const {startRecording, stopRecording, reset, status, uri} =
    useAudioRecording();

  let currentState = 'idle';
  if (status && status.isRecording) {
    currentState = 'active';
  } else if (uri) {
    currentState = 'done';
  }

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

  if (currentState === 'idle') {
    return <RecordingIdle onPressRecord={startRecording} />;
  }

  if (currentState === 'active') {
    return (
      <RecordingActive
        duration={status?.durationMillis || 0}
        onPressStop={stopRecording}
      />
    );
  }

  if (currentState === 'done') {
    return (
      <RecordingDone
        uri={uri || ''}
        duration={status?.durationMillis || 0}
        onDelete={() => {
          navigation.goBack();
          reset();
        }}
        onRecordAnother={reset}
      />
    );
  }

  return null;
}
