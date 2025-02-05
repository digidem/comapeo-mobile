import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Duration} from 'luxon';

import {BLACK, DARK_GREY, MAGENTA, MEDIUM_GREY, WHITE} from '../../lib/styles';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';
import {AnimatedBackground} from './AnimatedBackground';
import {useAudioRecording} from '../Audio/CreateRecording/useAudioRecording';
import {usePreventBackButtonWhileRecording} from './usePreventBackButtonWhileRecording';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

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

export function AudioRecording({}: NativeRootNavigationProps<'AudioRecording'>) {
  const {startRecording, stopRecording, status, uri, error, setError} =
    useAudioRecording();

  const timeElapsed = status?.durationMillis || 0;
  const isRecording = !!status?.isRecording;

  const {formatMessage} = useIntl();

  usePreventBackButtonWhileRecording({
    shouldPrevent: isRecording || !!uri,
  });

  const finishRecording = React.useCallback(() => {
    stopRecording();
    //navigation.navigate('AudioRecordingDone', {uri})
  }, [stopRecording]);

  // if recording is longer than 5 minutes, finish recording
  React.useEffect(() => {
    if (timeElapsed >= MAX_RECORDING_DURATION_MS) {
      finishRecording();
    }
  }, [timeElapsed, finishRecording]);

  if (!error && isRecording && !uri) {
    setError(new Error('Recording is done, but no URI is available.'));
  }

  return (
    <>
      <ScreenContentWithDock
        contentContainerStyle={styles.contentContainer}
        dockContainerStyle={styles.dockContainer}
        dockContent={
          <TouchableOpacity
            onPress={!isRecording ? startRecording : finishRecording}
            style={styles.basePressable}>
            {<View style={!isRecording ? styles.record : styles.stop} />}
          </TouchableOpacity>
        }>
        <View style={styles.container}>
          <View style={styles.timerContainer}>
            <Text
              style={[
                styles.timerText,
                {color: timeElapsed === 0 ? MEDIUM_GREY : WHITE},
              ]}>
              {Duration.fromMillis(timeElapsed).toFormat('mm:ss')}
            </Text>
          </View>
          <HeaderText variant="header3" style={styles.message}>
            {!isRecording
              ? formatMessage(m.record5Min)
              : timeElapsed < 240000
                ? formatMessage(m.lessThan5)
                : formatMessage(m.lessThan1)}
          </HeaderText>
        </View>
      </ScreenContentWithDock>
      <AnimatedBackground timeElapsed={timeElapsed} />
    </>
  );
}

export const navigationOptions: NativeStackNavigationOptions = {
  contentStyle: {backgroundColor: DARK_GREY},
  headerTintColor: WHITE,
  headerShadowVisible: false,
  headerTitle: () => null,
  headerStyle: {backgroundColor: 'transparent'},
  headerTransparent: true,
  headerLeft: props => (
    <CustomHeaderLeft
      tintColor={props.tintColor}
      headerBackButtonProps={props}
    />
  ),
};

const styles = StyleSheet.create({
  contentContainer: {flex: 1},
  dockContainer: {paddingVertical: 24},
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 48,
  },
  message: {
    color: WHITE,
    textAlign: 'center',
  },
  timerText: {
    fontFamily: 'Rubik',
    fontSize: 96,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  basePressable: {
    height: PRIMARY_CONTROL_DIAMETER,
    width: PRIMARY_CONTROL_DIAMETER,
    borderRadius: PRIMARY_CONTROL_DIAMETER,
    borderWidth: 12,
    borderColor: WHITE,
    overflow: 'hidden',
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignSelf: 'center',
  },
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
