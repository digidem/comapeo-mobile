import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {defineMessages, useIntl} from 'react-intl';
import {DestructiveButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import Error from '../images/Error.svg';
import {useTracking} from '../hooks/useTracking';
import {useTrackState} from '../contexts/TrackStoreContext';
import {IconTitleDescription} from '../sharedComponents/IconTitleDescription';

const m = defineMessages({
  recordingTracks: {
    id: 'screens.TrackRecordingActive.recordingTracks',
    defaultMessage: 'Recording Tracks!',
  },
  warningMessage: {
    id: 'screens.TrackRecordingActive.warningMessage',
    defaultMessage: 'Tracks is recording. Stop Tracks to continue.',
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
  const {endTracking} = useTracking();
  const distance = useTrackState(store => store.distance);

  function handleStopTracks() {
    endTracking();
    const hasMovedEnough = distance > 0.001;
    if (hasMovedEnough) {
      navigation.replace('TrackCategoryChooser', {trackAction: 'saveNew'});
      return;
    } else {
      navigation.goBack();
    }
  }

  return (
    <BottomSheetWrapper>
      <IconTitleDescription
        icon={<Error />}
        title={formatMessage(m.recordingTracks)}
        description={formatMessage(m.warningMessage)}
      />
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
