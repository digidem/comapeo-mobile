import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {AUDIO_BLACK, AUDIO_RED, WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Duration} from 'luxon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {useStopwatch} from 'react-timer-hook';

const MAX_DURATION = 300_000;

export const AudioRecordingScreen: React.FC<
  NativeRootNavigationProps<'AudioRecording'>
> = params => {
  const {recording} = params.route.params;
  const navigator = useNavigationFromRoot();

  const stopwatch = useStopwatch({autoStart: true});
  const formattedElapsedTime = Duration.fromMillis(
    stopwatch.totalSeconds * 1000,
  ).toFormat('mm:ss');

  const {top: topInset} = useSafeAreaInsets();
  const {height: windowHeight} = Dimensions.get('window');

  const fillPercentage = stopwatch.totalSeconds * 1000 * (1 / MAX_DURATION);

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.timerStyle}>{formattedElapsedTime}</Text>
        <Text style={styles.textStyle}>Less than 5 minutes left</Text>
        <Pressable
          onPress={async () => {
            await recording.stopAndUnloadAsync();
            navigator.navigate('AudioPlayback', {
              recordingUri: recording.getURI()!,
            });
            stopwatch.reset();
          }}
          style={styles.buttonWrapperStyle}>
          <View style={styles.buttonStopStyle} />
        </Pressable>
        <View
          style={[
            styles.fill,
            {
              height: (windowHeight + topInset) * fillPercentage,
              // 50% is max lightness from designs, hence `fillPercentage * 50`
              backgroundColor: `hsl(216, 100%, ${fillPercentage * 50}%)`,
            },
          ]}
        />
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
