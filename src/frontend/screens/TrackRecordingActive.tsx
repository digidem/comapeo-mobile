import {View} from 'react-native';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {DestructiveButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import Error from '../images/Error.svg';
import {useStartStopTracks} from '../hooks/useTracking';

const m = defineMessages({
  recordingTracks: {
    id: 'screens.TrackRecordingActive.recordingTracks',
    defaultMessage: 'Recording Tracks!',
  },
  warningMessage: {
    id: 'screens.TrackRecordingActive.warningMessage',
    defaultMessage:
      'You’re currently recording a track. To join project, stop recording',
  },
  stopTracks: {
    id: 'screens.TrackRecordingActive.stopTracks',
    defaultMessage: 'Stop Tracks',
  },
  cancel: {
    id: 'screens.TrackRecordingActive.cancel',
    defaultMessage: 'Cancel',
  },
});

export const TrackRecordingActive = ({
  navigation,
}: NativeRootNavigationProps<'TrackRecordingActive'>) => {
  const {formatMessage} = useIntl();
  const {endTracking, clearCurrentTrack} = useStartStopTracks();

  function handleStopTracks() {
    const distanceSaved = endTracking();

    if (distanceSaved > 1) {
      navigation.replace('SaveTrack');
      return;
    }

    clearCurrentTrack();
    navigation.goBack();
  }

  return (
    <BottomSheetWrapper>
      <View style={{alignItems: 'center'}}>
        <Error />
        <HeaderText
          style={{textAlign: 'center', marginTop: 20}}
          variant="header2">
          {formatMessage(m.recordingTracks)}
        </HeaderText>
        <BodyText style={{textAlign: 'center', marginTop: 20}}>
          {formatMessage(m.warningMessage)}
        </BodyText>
      </View>
      <DestructiveButton
        fullSize={true}
        onPress={handleStopTracks}
        style={{marginTop: 20, alignSelf: 'center'}}
        text={formatMessage(m.stopTracks)}
      />
      <SecondaryButton
        fullSize={true}
        onPress={() => navigation.goBack()}
        style={{marginTop: 20, alignSelf: 'center'}}
        text={formatMessage(m.cancel)}
      />
    </BottomSheetWrapper>
  );
};
