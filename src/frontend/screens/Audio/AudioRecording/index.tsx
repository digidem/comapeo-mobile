import React from 'react';
import {StyleSheet, TouchableOpacity, View, AppState, Text} from 'react-native';
import {BLUE_GREY, DARK_GREY, WHITE} from '../../../lib/styles';
import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {AnimatedBackground} from './AnimatedBackground';
import {useAudioRecording} from './useAudioRecording';
import {usePreventBackButtonWhileRecording} from './usePreventBackButtonWhileRecording';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {
  audioStyles,
  PRIMARY_CONTROL_DIAMETER,
  MAX_RECORDING_DURATION_MS,
} from '../shared';
import {UIActivityIndicator} from 'react-native-indicators';
import {millisecondsToMMSS} from '../../../lib/millisecondsToFormattedTime';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

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
  const {startRecording, stopRecording, status} = useAudioRecording();
  const timeElapsed = status?.durationMillis || 0;
  const [isLoading, setIsLoading] = React.useState(true);

  const {formatMessage} = useIntl();

  usePreventBackButtonWhileRecording({
    shouldPrevent: !isLoading,
  });

  React.useEffect(() => {
    const start = async () => {
      await startRecording();
      setIsLoading(false);
    };
    start();
  }, [startRecording]);

  const finishRecording = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await stopRecording();
      if (!result?.uri || !result.createdAt) {
        navigation.replace('ErrorBottomSheet');
        return;
      }
      navigation.replace('AudioDraftPlaybackScreen', {
        uri: result.uri,
        createdAt: result.createdAt,
        showRecordingSavedText: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [stopRecording, navigation]);

  React.useEffect(() => {
    if (timeElapsed >= MAX_RECORDING_DURATION_MS && !isLoading) {
      finishRecording();
    }
  }, [timeElapsed, isLoading, finishRecording]);

  React.useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active' && !isLoading) {
        finishRecording();
      }
    });
    return () => sub.remove();
  }, [isLoading, finishRecording]);

  return (
    <View style={styles.background}>
      <ScreenContentWithDock
        contentContainerStyle={styles.contentContainer}
        dockContainerStyle={styles.dockContainer}
        dockContent={
          isLoading ? (
            <View style={styles.center}>
              <UIActivityIndicator
                color={WHITE}
                size={PRIMARY_CONTROL_DIAMETER}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={finishRecording}
              style={audioStyles.basePressable}
              accessibilityLabel="Stop recording audio.">
              <View style={audioStyles.stop} />
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
            <Text style={audioStyles.timerText}>
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
      {!isE2E && <AnimatedBackground timeElapsed={timeElapsed} />}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: DARK_GREY,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dockContainer: {
    paddingVertical: 24,
    backgroundColor: 'transparent',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
    marginTop: 20,
  },
  timerContainer: {flex: 1, justifyContent: 'flex-start'},
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
});
