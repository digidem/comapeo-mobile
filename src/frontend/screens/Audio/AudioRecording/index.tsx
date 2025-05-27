import React from 'react';
import {StyleSheet, TouchableOpacity, View, AppState, Text} from 'react-native';

import {BLACK, BLUE_GREY, WHITE} from '../../../lib/styles';
import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {AnimatedBackground} from './AnimatedBackground';
import {useAudioRecording} from './useAudioRecording';
import {usePreventBackButtonWhileRecording} from './usePreventBackButtonWhileRecording';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {AudioStyles} from '../shared';
import {UIActivityIndicator} from 'react-native-indicators';
import {millisecondsToMMSS} from '../../../lib/millisecondsToFormattedTime';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

// 5 minutes
const MAX_RECORDING_DURATION_MS = 300000;
const PRIMARY_CONTROL_DIAMETER = 96;

const m = defineMessages({
  lessThan5: {
    id: 'screens.AudioRecording.lessThan5',
    defaultMessage: 'Less than 5 minutes left',
  },
  lessThan1: {
    id: 'screens.AudioRecording.lessThan1',
    defaultMessage: 'Less than a minute left',
  },
  nowRecording: {
    id: 'screens.AudioRecording.nowRecording',
    defaultMessage: 'Now Recording...',
  },
});

export function AudioRecording({
  navigation,
}: NativeRootNavigationProps<'AudioRecording'>) {
  const isE2E = process.env.EXPO_PUBLIC_E2E_TEST === 'true';
  const {startRecording, stopRecording, status, isStopping} =
    useAudioRecording();
  const timeElapsed = status?.durationMillis || 0;
  const isRecording = !!status?.isRecording;

  const {formatMessage} = useIntl();

  usePreventBackButtonWhileRecording({
    shouldPrevent: isRecording,
  });

  React.useEffect(() => {
    startRecording();
  }, [startRecording]);

  const finishRecording = React.useCallback(async () => {
    const result = await stopRecording();
    if (result?.uri && result.createdAt) {
      navigation.replace('AudioPlaybackNew', {
        uri: result.uri,
        createdAt: result.createdAt,
      });
    }
  }, [stopRecording, navigation]);

  React.useEffect(() => {
    if (timeElapsed >= MAX_RECORDING_DURATION_MS && isRecording) {
      finishRecording();
    }
  }, [timeElapsed, isRecording, finishRecording]);

  React.useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active' && isRecording) {
        finishRecording();
      }
    });
    return () => sub.remove();
  }, [isRecording, finishRecording]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== 'active' && isRecording) {
        finishRecording();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isRecording, finishRecording]);

  return (
    <>
      <ScreenContentWithDock
        contentContainerStyle={AudioStyles.contentContainer}
        dockContainerStyle={AudioStyles.dockContainer}
        dockContent={
          isStopping ? (
            <View style={styles.center}>
              <UIActivityIndicator
                color={WHITE}
                size={PRIMARY_CONTROL_DIAMETER}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={finishRecording}
              style={AudioStyles.basePressable}
              accessibilityLabel="Stop recording audio.">
              <View style={styles.stop} />
            </TouchableOpacity>
          )
        }>
        <View style={styles.timerContainer}>
          <View>
            <BodyText variant="large" style={styles.recordingText}>
              {formatMessage(m.nowRecording)}
            </BodyText>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.timerText}>
              {millisecondsToMMSS(timeElapsed)}
            </Text>
            <BodyText variant="smallMeta" style={styles.messageText}>
              {timeElapsed < 240000
                ? formatMessage(m.lessThan5)
                : formatMessage(m.lessThan1)}
            </BodyText>
          </View>
        </View>
      </ScreenContentWithDock>
      {/* Remove animated background in E2E mode to avoid performance issues in Appium/BrowserStack */}
      {isE2E ? (
        <View style={{height: 0}} />
      ) : (
        <AnimatedBackground timeElapsed={timeElapsed} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
    marginTop: 20,
  },
  timerContainer: {flex: 1, justifyContent: 'flex-start'},
  stop: {
    height: PRIMARY_CONTROL_DIAMETER / 3,
    width: PRIMARY_CONTROL_DIAMETER / 3,
    backgroundColor: BLACK,
    alignSelf: 'center',
  },
  recordingText: {
    color: WHITE,
    textAlign: 'center',
    paddingTop: 65,
  },
  messageText: {
    color: BLUE_GREY,
    textAlign: 'center',
    paddingTop: 40,
  },
  timerText: {
    color: WHITE,
    textAlign: 'center',
    fontSize: 96,
    fontFamily: 'Rubik_500Medium',
  },
});
