import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AUDIO_BLACK, AUDIO_RED, WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import {AudioStackParamList} from '../../sharedTypes/navigation.ts';
import {useDerivedValue, withTiming} from 'react-native-reanimated';
import {AnimatedBackground} from './AnimatedBackground.tsx';
import {useAudioRecordingContext} from '../../contexts/AudioRecordingContext.tsx';
import {AnimatedTimer} from './AnimatedTimer.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export const MAX_DURATION = 300_000;

export const AudioRecordingScreen: React.FC<
  NativeStackScreenProps<AudioStackParamList, 'Recording'>
> = ({navigation}) => {
  const {stopRecording, recording, timeElapsed} = useAudioRecordingContext();
  const elapsedTimeValue = useDerivedValue(() => {
    return withTiming(timeElapsed, {duration: 500});
  }, [timeElapsed]);

  // Stop recording when time runs out (MAX_DURATION)
  useEffect(() => {
    if (timeElapsed <= MAX_DURATION) {
      return;
    }
    stopRecording().then(() => {
      navigation.navigate('Playback', {
        recordingUri: recording?.getURI()!,
      });
    });
  }, [navigation, stopRecording, recording, timeElapsed]);

  const handleStopRecordingButtonPress = async () => {
    await stopRecording();
    navigation.navigate('Playback', {
      recordingUri: recording?.getURI()!,
    });
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <AnimatedTimer elapsedTime={elapsedTimeValue} />
        <Text style={styles.textStyle}>Less than 5 minutes left</Text>
        <Pressable
          onPress={handleStopRecordingButtonPress}
          style={styles.buttonWrapperStyle}>
          <View style={styles.buttonStopStyle} />
        </Pressable>
        <AnimatedBackground elapsedTimeValue={elapsedTimeValue} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AUDIO_BLACK,
    height: '100%',
    flex: 1,
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    width: '100%',
  },
  timerStyle: {
    fontFamily: 'Rubik',
    fontSize: 96,
    color: WHITE,
    marginTop: 'auto',
    textAlign: 'center',
    marginBottom: 109,
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
    zIndex: 99,
  },
  buttonStartStyle: {
    height: 60,
    width: 60,
    backgroundColor: AUDIO_RED,
  },
  buttonStopStyle: {
    height: 30,
    width: 30,
    backgroundColor: AUDIO_BLACK,
  },
});
