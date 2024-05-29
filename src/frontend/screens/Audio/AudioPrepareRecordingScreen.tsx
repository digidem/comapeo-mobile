import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  AUDIO_BLACK,
  AUDIO_DARK_GRAY,
  AUDIO_RED,
  WHITE,
} from '../../lib/styles.ts';
import React from 'react';
import {useAudioRecordingContext} from '../../contexts/AudioRecordingContext.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AudioStackParamList} from '../../sharedTypes/navigation.ts';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  defaultTimerState: {
    id: 'screens.Audio.PrepareRecording.defaultTimerState',
    defaultMessage: '00:00',
  },
  subTimerMessage: {
    id: 'screens.Audio.PrepareRecording.subTimerMessage',
    defaultMessage: 'Record up to 5 minutes',
  },
});

export const AudioPrepareRecordingScreen: React.FC<
  NativeStackScreenProps<AudioStackParamList, 'PrepareRecording'>
> = ({navigation}) => {
  const {startRecording} = useAudioRecordingContext();
  const handlePress = async () => {
    await startRecording();
    navigation.navigate('Recording');
  };
  const {formatMessage: t} = useIntl();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timerStyle}>{t(m.defaultTimerState)}</Text>
      <Text style={styles.textStyle}>{t(m.subTimerMessage)}</Text>
      <Pressable onPress={handlePress} style={styles.buttonWrapperStyle}>
        <View style={styles.buttonStartStyle} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AUDIO_BLACK,
    height: '100%',
    flex: 1,
  },
  timerStyle: {
    fontFamily: 'Rubik',
    fontSize: 96,
    color: AUDIO_DARK_GRAY,
    marginTop: 'auto',
    textAlign: 'center',
    marginBottom: 120,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 50,
    fontSize: 20,
    color: WHITE,
  },
  buttonWrapperStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 96,
    backgroundColor: WHITE,
    marginBottom: 30,
  },
  buttonStartStyle: {
    height: 60,
    width: 60,
    borderRadius: 96,
    backgroundColor: AUDIO_RED,
  },
  buttonStopStyle: {
    height: 30,
    width: 30,
    backgroundColor: AUDIO_BLACK,
  },
});
