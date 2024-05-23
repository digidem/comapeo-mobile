import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AUDIO_BLACK, AUDIO_RED, WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Duration} from 'luxon';
import PlayArrow from '../../images/playArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {Audio, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';
import {Sound} from 'expo-av/build/Audio/Sound';

export const AudioPlaybackScreen: React.FC<
  NativeRootNavigationProps<'AudioPlayback'>
> = params => {
  const {recordingUri} = params.route.params;
  const [recordedSound, setRecordedSound] = useState<Sound | null>(null);
  const [soundInitialStatus, setSoundInitialStatus] =
    useState<AVPlaybackStatusSuccess | null>();
  const [isPlaying, setPlaying] = useState(false);
  const [currentPositionMillis, setCurrentPositionMillis] = useState(0);

  useEffect(() => {
    Audio.Sound.createAsync({
      uri: recordingUri,
    }).then(sound => {
      setRecordedSound(sound.sound);
      setSoundInitialStatus(sound.status as AVPlaybackStatusSuccess);
    });
  }, [recordingUri]);

  if (!recordedSound || !soundInitialStatus) return null;

  const audioCallbackHandler = (status: AVPlaybackStatus) => {
    const update = status as AVPlaybackStatusSuccess;
    if (update.didJustFinish) {
      setPlaying(false);
      setCurrentPositionMillis(0);
      recordedSound.stopAsync();
    } else {
      setPlaying(update.isPlaying);
      if (update.isPlaying) {
        setCurrentPositionMillis(update.positionMillis);
      }
    }
  };

  const handleControlButtonPress = async () => {
    // State handling is done in callback handler, so we're not setting isPlaying to true
    // after starting playback or handling current position in recording via own stopwatch.
    if (isPlaying) {
      await recordedSound.stopAsync();
    } else {
      await recordedSound.playAsync();
      recordedSound.setOnPlaybackStatusUpdate(audioCallbackHandler);
    }
  };

  const audioLength = soundInitialStatus.durationMillis!;

  const formattedAudioLength =
    Duration.fromMillis(audioLength).toFormat('mm:ss');
  const formattedElapsedTime = Duration.fromMillis(
    currentPositionMillis,
  ).toFormat('mm:ss');

  const {width} = Dimensions.get('window');
  const fillPercentage = currentPositionMillis * (1 / audioLength);

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.timerStyle}>{formattedElapsedTime}</Text>
        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBar, {width: width - 60}]} />
          <View
            style={[
              styles.progressBar,
              {width: fillPercentage * (width - 60), backgroundColor: WHITE},
            ]}
          />
        </View>
        <Text style={styles.textStyle}>
          Total length: {formattedAudioLength}
        </Text>
        <View style={styles.bottomBar}>
          <MaterialIcons size={35} name="delete" color={WHITE} />
          <Pressable
            disabled={!recordedSound}
            onPress={handleControlButtonPress}
            style={styles.buttonWrapperStyle}>
            {isPlaying ? (
              <View style={styles.buttonStopStyle} />
            ) : (
              <PlayArrow />
            )}
          </Pressable>
          <MaterialIcons size={35} name="share" color={WHITE} />
        </View>
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
    color: WHITE,
    marginTop: 'auto',
    textAlign: 'center',
    marginBottom: 115,
  },
  progressBarWrapper: {
    position: 'relative',
  },
  progressBar: {
    bottom: 82,
    marginLeft: 30,
    height: 4,
    backgroundColor: '#757575',
    position: 'absolute',
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 50,
    fontSize: 20,
    color: '#CCCCD6',
  },
  bottomBar: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  buttonWrapperStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 96,
    backgroundColor: WHITE,
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
