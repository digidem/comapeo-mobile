import {View} from 'react-native';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {DestructiveButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';

const m = defineMessages({
  recordingTracks: {
    id: 'screens.TrackRecordingActive.recordingTracks',
    defaultMessage: 'Recording Tracks',
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
  return (
    <BottomSheetWrapper>
      <View>
        <HeaderText>{formatMessage(m.recordingTracks)}</HeaderText>
        <BodyText>{formatMessage(m.warningMessage)}</BodyText>
      </View>
      <DestructiveButton
        fullSize={true}
        onPress={() => {}}
        text={formatMessage(m.stopTracks)}
      />
      <SecondaryButton
        fullSize={true}
        onPress={() => navigation.goBack()}
        text={formatMessage(m.cancel)}
      />
    </BottomSheetWrapper>
  );
};
