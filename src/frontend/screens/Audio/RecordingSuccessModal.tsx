import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {FC} from 'react';
import {BottomSheetModal} from '../../sharedComponents/BottomSheetModal';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {StyleSheet, Text, View} from 'react-native';
import SuccessIcon from '../../images/GreenCheck.svg';
import {Button} from '../../sharedComponents/Button';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

const m = defineMessages({
  successTitle: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.successTitle',
    defaultMessage: 'Success!',
  },
  successDescription: {
    id: 'AudioPlaybackScreen.DeleteAudioRecordingModal.successDescription',
    defaultMessage: 'Your <bold>{audioRecording}</bold> was added.',
  },
  returnToEditorButtonText: {
    id: 'AudioPlaybackScreen.SuccessAudioRecordingModal.returnToEditor',
    defaultMessage: 'Return to Editor',
  },
  recordAnotherButtonText: {
    id: 'AudioPlaybackScreen.SuccessAudioRecordingModal.recordAnother',
    defaultMessage: 'Record Another',
  },
  audioRecording: {
    id: 'AudioPlaybackScreen.SuccessAudioRecordingModal.audioRecording',
    defaultMessage: 'Audio Recording',
  },
});

interface RecordingSuccessModal {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
}

export const RecordingSuccessModal: FC<RecordingSuccessModal> = ({
  sheetRef,
  isOpen,
}) => {
  const navigation = useNavigationFromRoot();

  const {formatMessage} = useIntl();

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen} fullScreen>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <SuccessIcon />
          <Text style={styles.title}>{formatMessage(m.successTitle)}</Text>
          <Text style={styles.description}>
            <FormattedMessage
              {...m.successDescription}
              values={{
                audioRecording: formatMessage(m.audioRecording),
                bold: message => <Text style={styles.textBold}>{message}</Text>,
              }}
            />
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            flex: 1,
            gap: 15,
          }}>
          <Button
            fullWidth
            onPress={() => navigation.navigate('ObservationEdit')}
            variant="outlined"
            color="ComapeoBlue">
            {formatMessage(m.returnToEditorButtonText)}
          </Button>
          <Button fullWidth onPress={() => navigation.navigate('Audio')}>
            {formatMessage(m.recordAnotherButtonText)}
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 20,
    paddingTop: 80,
  },
  wrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
  },
  description: {fontSize: 16, marginTop: 40},
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
