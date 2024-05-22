import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {AUDIO_BLACK, AUDIO_RED, DARK_GREY, WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Duration} from 'luxon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MAX_DURATION = 300_000;

export const AudioRecordingScreen = () => {
  const navigator = useNavigationFromRoot();
  const [elapsedTime, setElapsedTime] = useState(290000);
  const formattedElapsedTime =
    Duration.fromMillis(elapsedTime).toFormat('mm:ss');
  const {top: topInset} = useSafeAreaInsets();
  const {height: windowHeight} = Dimensions.get('window');

  const fillPercentage = elapsedTime * (1 / MAX_DURATION);

  useEffect(() => {
    const interval = setInterval(
      () => setElapsedTime(elapsedTime + 1000),
      1000,
    );
    return () => clearInterval(interval);
  }, [elapsedTime]);

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.timerStyle}>{formattedElapsedTime}</Text>
        <Text style={styles.textStyle}>Less than 5 minutes left</Text>
        <View>
          <Pressable
            onPress={() => navigator.navigate('AudioPlayback')}
            style={styles.buttonWrapperStyle}>
            <View style={styles.buttonStopStyle} />
          </Pressable>
          <MaterialIcons size={30} name={'share'} color={DARK_GREY} />
        </View>

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
