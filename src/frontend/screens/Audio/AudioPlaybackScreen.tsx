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
import React, {useState} from 'react';
import {Duration} from 'luxon';
import PlayArrow from '../../images/playArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const AudioPlaybackScreen = () => {
  const audioLength = 162402;
  const formattedAudioLength =
    Duration.fromMillis(audioLength).toFormat('mm:ss');

  const [elapsedTime] = useState(160000);
  const formattedElapsedTime =
    Duration.fromMillis(elapsedTime).toFormat('mm:ss');

  const [isPlaying, setIsPlaying] = useState(false);

  const {width} = Dimensions.get('window');
  const fillPercentage = elapsedTime * (1 / audioLength);

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
            onPress={() => setIsPlaying(!isPlaying)}
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
