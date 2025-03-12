import * as React from 'react';
import {AudioStyles, SIDE_ICON_BUTTON_WIDTH} from './shared';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {useAudioPlayback} from '../../hooks/useAudioPlayback';
import {Duration} from 'luxon';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {Bar} from 'react-native-progress';
import {WHITE, MEDIUM_GREY} from '../../lib/styles';
import {ErrorBottomSheetDeprecated} from '../../sharedComponents/ErrorBottomSheetDeprecated';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PlayArrow from '../../images/PlayArrow.svg';
import {useFocusEffect} from '@react-navigation/native';
import {useDraftObservation} from '../../hooks/useDraftObservation';

const m = defineMessages({
  description: {
    id: 'screens.AudioPlaybackUnsaved.description',
    defaultMessage: 'Total length: {length}',
  },
});
export const AudioPlaybackUnsaved = ({
  route,
  navigation,
}: NativeRootNavigationProps<
  'AudioPlaybackUnsavedReview' | 'AudioPlaybackUnsavedPreview'
>) => {
  const uri = route.params.uri;
  const {
    duration,
    currentPosition,
    isPlaying,
    stopPlayback,
    startPlayback,
    error,
    clearError,
  } = useAudioPlayback(uri);

  const {deleteAudio} = useDraftObservation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (route.name === 'AudioPlaybackUnsavedReview') {
          return true;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [route.name]),
  );
  const {formatMessage} = useIntl();

  const progress = currentPosition / duration;

  function onPressDelete() {
    deleteAudio(uri, false);
    navigation.popTo('ObservationCreate');
  }

  return (
    <>
      <ScreenContentWithDock
        contentContainerStyle={AudioStyles.contentContainer}
        dockContainerStyle={AudioStyles.dockContainer}
        dockContent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Pressable
                onPress={() =>
                  navigation.navigate('DeleteAudioBottomSheet', {
                    onPressDelete,
                    uri,
                  })
                }>
                <MaterialIcon
                  name="delete"
                  color={WHITE}
                  size={SIDE_ICON_BUTTON_WIDTH}
                />
              </Pressable>
            </View>
            {isPlaying ? (
              <TouchableOpacity
                onPress={stopPlayback}
                style={AudioStyles.basePressable}>
                <View style={AudioStyles.stop} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={startPlayback}
                style={AudioStyles.basePressable}>
                <View style={AudioStyles.play}>
                  <PlayArrow />
                </View>
              </TouchableOpacity>
            )}
            <View style={{flex: 1}} />
          </View>
        }>
        <View style={AudioStyles.container}>
          <View style={AudioStyles.timerContainer}>
            <Text
              style={[
                AudioStyles.timerText,
                {
                  color:
                    currentPosition === 0 && !isPlaying ? MEDIUM_GREY : WHITE,
                },
              ]}>
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
      <ErrorBottomSheetDeprecated
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
