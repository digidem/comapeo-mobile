import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {RecordingActive} from './RecordingActive';
import {RecordingDone} from './RecordingDone';
import {RecordingIdle} from './RecordingIdle';
import {useAudioRecording} from './useAudioRecording';

export function CreateRecording() {
  const navigation = useNavigationFromRoot();
  const recordingState = useAudioRecording();

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
    case 'done': {
      return (
        <RecordingDone
          createdAt={recordingState.createdAt}
          uri={recordingState.uri}
          duration={recordingState.duration}
          onDelete={async () => {
            await recordingState.deleteRecording().catch(err => {
              console.log(err);
            });
            navigation.goBack();
          }}
        />
      );
    }
  }
}
