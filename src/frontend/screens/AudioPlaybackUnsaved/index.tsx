import * as React from 'react';
import {
  AudioStyles,
  sharedAudioNavOptions,
} from '../../sharedComponents/AudioStyles';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {useAudioPlayback} from '../Audio/useAudioPlayback';
import {Duration} from 'luxon';
import {View, Text} from 'react-native';
import {Bar} from 'react-native-progress';
import {WHITE, MEDIUM_GREY} from '../../lib/styles';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {HeaderBackButton} from '@react-navigation/elements';
import {CloseIcon} from '../../sharedComponents/icons';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  description: {
    id: 'screens.AudioPlaybackUnsaved.description',
    defaultMessage: 'Total length: {length}',
  },
});
export const AudioPlaybackUnsaved = ({
  route,
}: NativeRootNavigationProps<'AudioPlaybackUnsaved'>) => {
  const {
    duration,
    currentPosition,
    isPlaying,
    stopPlayback,
    startPlayback,
    error,
    clearError,
  } = useAudioPlayback(route.params.uri);

  const {formatMessage} = useIntl();

  const progress = currentPosition / duration;

  return (
    <>
      <ScreenContentWithDock
        contentContainerStyle={AudioStyles.contentContainer}
        dockContainerStyle={AudioStyles.dockContainer}
        dockContent={<></>}>
        <View style={AudioStyles.container}>
          <View style={AudioStyles.timerContainer}>
            <Text style={AudioStyles.timerText}>
              {Duration.fromMillis(currentPosition).toFormat('mm:ss')}
            </Text>
            <Bar
              // Setting to 0 seems to have issues on Android: https://github.com/oblador/react-native-progress/issues/56
              progress={progress > 0 ? progress : 0.00000001}
              indeterminate={false}
              width={null}
              color={WHITE}
              borderColor="transparent"
              borderRadius={0}
              borderWidth={0}
              unfilledColor={MEDIUM_GREY}
            />
          </View>
          <HeaderText variant="header3" style={AudioStyles.message}>
            {formatMessage(m.description, {
              length: Duration.fromMillis(duration).toFormat('mm:ss'),
            })}
          </HeaderText>
        </View>
      </ScreenContentWithDock>
      <ErrorBottomSheet
        error={error}
        clearError={clearError}
        tryAgain={() => {
          clearError();
          if (isPlaying) {
            stopPlayback();
          } else {
            startPlayback();
          }
        }}
      />
    </>
  );
};

export const navigationOptions: NativeStackNavigationOptions = {
  ...sharedAudioNavOptions,
  headerLeft: props => (
    <HeaderBackButton
      {...props}
      onPress={() => {}}
      backImage={backImageProps => (
        <CloseIcon color={backImageProps.tintColor} />
      )}
    />
  ),
};
