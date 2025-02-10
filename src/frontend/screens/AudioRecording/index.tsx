import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Duration} from 'luxon';

import {BLACK, MAGENTA, MEDIUM_GREY, WHITE} from '../../lib/styles';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';
import {AnimatedBackground} from './AnimatedBackground';
import {useAudioRecording} from '../Audio/CreateRecording/useAudioRecording';
import {usePreventBackButtonWhileRecording} from './usePreventBackButtonWhileRecording';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {AudioStyles} from '../../sharedComponents/AudioStyles';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {UIActivityIndicator} from 'react-native-indicators';

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
  record5Min: {
    id: 'screens.AudioRecording.record5Min',
    defaultMessage: 'Record up to 5 minutes',
  },
});

export function AudioRecording({
  navigation,
}: NativeRootNavigationProps<'AudioRecording'>) {
  const {startRecording, stopRecording, status, error, setError, reset} =
    useAudioRecording();

  const timeElapsed = status?.durationMillis || 0;
  const isRecording = !!status?.isRecording;

  const {formatMessage} = useIntl();

  usePreventBackButtonWhileRecording({
    shouldPrevent: isRecording,
  });

  const finishRecording = React.useCallback(() => {
    stopRecording()
      .then(uri => {
        if (!uri) {
          throw new Error('Recording is done, but no URI is available.');
        }
        navigation.replace('AudioPlaybackUnsavedReview', {
          uri,
          duration: timeElapsed,
        });
      })
      .catch(err => {
        setError(err);
      });
  }, [stopRecording, setError, navigation, timeElapsed]);

  // stop recording at 5 minutes
  React.useEffect(() => {
    if (timeElapsed >= MAX_RECORDING_DURATION_MS) {
      finishRecording();
    }
  }, [timeElapsed, finishRecording]);

  return (
    <>
      <ScreenContentWithDock
        contentContainerStyle={AudioStyles.contentContainer}
        dockContainerStyle={AudioStyles.dockContainer}
        dockContent={
          status?.isDoneRecording ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 60,
                marginTop: 20,
              }}>
              <UIActivityIndicator
                color={WHITE}
                size={PRIMARY_CONTROL_DIAMETER}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={!isRecording ? startRecording : finishRecording}
              style={AudioStyles.basePressable}>
              {<View style={!isRecording ? styles.record : styles.stop} />}
            </TouchableOpacity>
          )
        }>
        <View style={AudioStyles.container}>
          <View style={AudioStyles.timerContainer}>
            <Text
              style={[
                AudioStyles.timerText,
                {color: !isRecording ? MEDIUM_GREY : WHITE},
              ]}>
              {Duration.fromMillis(timeElapsed).toFormat('mm:ss')}
            </Text>
          </View>
          <HeaderText variant="header3" style={AudioStyles.message}>
            {!isRecording
              ? formatMessage(m.record5Min)
              : timeElapsed < 240000
                ? formatMessage(m.lessThan5)
                : formatMessage(m.lessThan1)}
          </HeaderText>
        </View>
      </ScreenContentWithDock>
      <AnimatedBackground timeElapsed={timeElapsed} />
      <ErrorBottomSheet error={error} clearError={reset} />
    </>
  );
}

const styles = StyleSheet.create({
  record: {
    height: PRIMARY_CONTROL_DIAMETER,
    backgroundColor: MAGENTA,
  },
  stop: {
    height: PRIMARY_CONTROL_DIAMETER / 3,
    width: PRIMARY_CONTROL_DIAMETER / 3,
    backgroundColor: BLACK,
    alignSelf: 'center',
  },
});
