import React, {useEffect} from 'react';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {RecordingActive} from './RecordingActive';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';

export function CreateRecording() {
  const navigation = useNavigationFromRoot();
  const recordingState = useAudioRecording();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      recordingState.reset().catch(error => {
        console.error('Error resetting recording:', error);
      });
    });

    return unsubscribe;
  }, [navigation, recordingState]);

  switch (recordingState.status) {
    case 'idle': {
      return <RecordingIdle onPressRecord={recordingState.startRecording} />;
    }
    case 'active': {
      return (
        <RecordingActive
          duration={recordingState.duration}
          onPressStop={recordingState.stopRecording}
        />
      );
    }
  }
}
