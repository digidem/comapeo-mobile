import React, {FC} from 'react';
import {BottomSheetModal} from '../../../sharedComponents/BottomSheetModal';
import {StyleSheet, Text, View} from 'react-native';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {defineMessages, useIntl} from 'react-intl';
import {Actions} from '../../../sharedComponents/ActionTab/Actions';
import MessagesIcon from '../../../images/audio/Messages.svg';
import WhatsAppIcon from '../../../images/audio/WhatsApp.svg';
import MoreIcon from '../../../images/audio/More.svg';
import {convertUrlToBase64} from '../../../utils/base64';
import Share, {ShareSingleOptions, Social} from 'react-native-share';

interface AudioShareBottomSheet {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
  closeShareSheet: () => void;
  recordingUri: string;
}

export const AudioShareBottomSheet: FC<AudioShareBottomSheet> = ({
  sheetRef,
  isOpen,
  closeShareSheet,
  recordingUri,
}) => {
  const {formatMessage} = useIntl();

  async function handlePressShare() {
    const base64Url = await convertUrlToBase64(recordingUri);

    Share.open({
      title: formatMessage(m.audioRecording),
      url: base64Url,
      message: 'message',
    }).catch(() => {});
  }

  const handleSingleShare = async (
    social: Social.Whatsapp | Social.Sms,
    url: string,
  ) => {
    const base64Url = await convertUrlToBase64(url);
    const shareOptions: ShareSingleOptions = {
      title: formatMessage(m.title),
      url: base64Url,
      social: social,
      filename: 'recording.mp4', // only for base64 file in Android
    };

    await Share.shareSingle(shareOptions).catch(() => {});
    closeShareSheet();
  };

  const bottomSheetItems = [
    {
      icon: <MessagesIcon />,
      label: formatMessage(m.messages),
      onPress: closeShareSheet,
      withCircle: false,
    },
    {
      icon: <WhatsAppIcon />,
      label: formatMessage(m.whatsApp),
      onPress: () => handleSingleShare(Social.Whatsapp, recordingUri),
      withCircle: false,
    },
    {
      icon: <MoreIcon />,
      label: formatMessage(m.more),
      onPress: handlePressShare,
      withCircle: false,
    },
  ];

  return (
    <BottomSheetModal
      ref={sheetRef}
      isOpen={isOpen}
      onDismiss={closeShareSheet}>
      <View style={styles.container}>
        <Text style={styles.title}>{formatMessage(m.title)}</Text>
      </View>
      <Actions items={bottomSheetItems} />
    </BottomSheetModal>
  );
};

const m = defineMessages({
  title: {
    id: 'AudioPlaybackScreen.ShareAudioRecording.title',
    defaultMessage: 'Share via',
  },
  messages: {
    id: 'AudioPlaybackScreen.ShareAudioRecording.Options.messages',
    defaultMessage: 'Messages',
  },
  whatsApp: {
    id: 'AudioPlaybackScreen.ShareAudioRecording.Options.whatsApp',
    defaultMessage: 'WhatsApp',
  },
  more: {
    id: 'AudioPlaybackScreen.ShareAudioRecording.Options.more',
    defaultMessage: 'More',
  },
  audioRecording: {
    id: 'AudioPlaybackScreen.ShareAudioRecording.Share.title',
    defaultMessage: 'Audio recording',
  },
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
