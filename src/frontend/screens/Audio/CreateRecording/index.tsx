import React from 'react';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';

export function CreateRecording() {
  const navigation = useNavigationFromRoot();
  const {startRecording, stopRecording, reset, status, createdAt, uri} =
    useAudioRecording();

  return !status || (!status.isRecording && !uri) ? (
    <RecordingIdle onPressRecord={startRecording} />
  ) : status.isRecording ? (
    <RecordingActive
      duration={status?.durationMillis || 0}
      onPressStop={stopRecording}
    />
  ) : (
    <RecordingDone
      createdAt={createdAt || 0}
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
