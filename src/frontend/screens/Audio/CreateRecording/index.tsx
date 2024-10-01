import React from 'react';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';

export function CreateRecording() {
  const navigation = useNavigationFromRoot();
  const {startRecording, stopRecording, reset, status, uri} =
    useAudioRecording();

  if (!status || (!status.isRecording && !uri)) {
    return <RecordingIdle onPressRecord={startRecording} />;
  }

  if (status.isRecording) {
    return (
      <RecordingActive
        duration={status?.durationMillis || 0}
        onPressStop={stopRecording}
      />
    );
  }

  return (
    <RecordingDone
      uri={uri || ''}
      duration={status?.durationMillis || 0}
      onDelete={() => {
        reset();
        navigation.goBack();
      }}
      onRecordAnother={reset}
    />
  );
}
