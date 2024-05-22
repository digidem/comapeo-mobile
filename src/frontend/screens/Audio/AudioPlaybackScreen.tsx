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

export const AudioPlaybackScreen = () => {
  const [elapsedTime] = useState(0);
  const formattedElapsedTime =
    Duration.fromMillis(elapsedTime).toFormat('mm:ss');
  const {width} = Dimensions.get('window');

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.timerStyle}>{formattedElapsedTime}</Text>
        <View
          style={{
            marginBottom: 82,
            width: width - 60,
            alignSelf: 'center',
            height: 4,
            backgroundColor: '#757575',
          }}
        />
        <Text style={styles.textStyle}>Total length: 04:37</Text>
        <Pressable
          onPress={() => console.log('okok')}
          style={styles.buttonWrapperStyle}>
          <PlayArrow />
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
    color: WHITE,
    marginTop: 'auto',
    textAlign: 'center',
    marginBottom: 33,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 50,
    fontSize: 20,
    color: '#CCCCD6',
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
    backgroundColor: AUDIO_RED,
  },
  buttonStopStyle: {
    height: 30,
    width: 30,
    backgroundColor: AUDIO_BLACK,
  },
});
