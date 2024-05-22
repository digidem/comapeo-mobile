import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {
  AUDIO_BLACK,
  AUDIO_DARK_GRAY,
  AUDIO_RED,
  WHITE,
} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';

export const AudioPrepareRecordingScreen = () => {
  const navigator = useNavigationFromRoot();
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.timerStyle}>00:00</Text>
        <Text style={styles.textStyle}>Record up to 5 minutes</Text>
        <Pressable
          onPress={() => navigator.navigate('AudioRecording')}
          style={styles.buttonWrapperStyle}>
          <View style={styles.buttonStartStyle} />
        </Pressable>
      </SafeAreaView>
    </>
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
