import * as React from 'react';
import {
  AudioStyles,
  SIDE_ICON_BUTTON_WIDTH,
} from '../sharedComponents/AudioStyles';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {useAudioPlayback} from '../hooks/useAudioPlayback';
import {Duration} from 'luxon';
import {View, Text, Pressable, TouchableOpacity} from 'react-native';
import {Bar} from 'react-native-progress';
import {WHITE, MEDIUM_GREY} from '../lib/styles';
import {ErrorBottomSheet} from '../sharedComponents/ErrorBottomSheet';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PlayArrow from '../images/PlayArrow.svg';
import {UIActivityIndicator} from 'react-native-indicators';
import Share from 'react-native-share';
import * as FileSystem from 'expo-file-system';

const m = defineMessages({
  description: {
    id: 'screens.AudioPlaybackUnsaved.description',
    defaultMessage: 'Total length: {length}',
  },
});
export const AudioPlaybackSaved = ({
  route,
  navigation,
}: NativeRootNavigationProps<'AudioPlaybackSaved'>) => {
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
  const {formatMessage} = useIntl();

  const progress = currentPosition / duration;

  const [localUri, setLocalUri] = React.useState<string | null>(null);
  const [shareLoading, setShareLoading] = React.useState(false);
  const [shareError, setShareError] = React.useState<Error | null>(null);

  const handleShare = React.useCallback(async () => {
    setShareLoading(true);
    try {
      let fileUri = localUri;

      if (!fileUri) {
        const tempFileName = `audio_${Date.now()}.m4a`;
        const localFilePath = `${FileSystem.cacheDirectory}${tempFileName}`;
        const {uri: downloadedUri} = await FileSystem.downloadAsync(
          uri,
          localFilePath,
        );

        fileUri = downloadedUri;
        setLocalUri(downloadedUri);
      }

      await Share.open({url: fileUri, failOnCancel: false});
    } catch (err) {
      setShareError(err as Error);
    } finally {
      setShareLoading(false);
    }
  }, [uri, localUri]);

  React.useEffect(() => {
    return () => {
      if (localUri) {
        FileSystem.deleteAsync(localUri, {idempotent: true}).catch(() => {});
      }
    };
  }, [localUri]);

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
              {route.params.canDelete && (
                <Pressable
                  onPress={() =>
                    navigation.navigate('DeleteAudioBottomSheet', {
                      screenToPopToAfterDelete: 'ObservationEdit',
                      uri,
                    })
                  }>
                  <MaterialIcon
                    name="delete"
                    color={WHITE}
                    size={SIDE_ICON_BUTTON_WIDTH}
                  />
                </Pressable>
              )}
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
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Pressable onPress={handleShare}>
                {shareLoading ? (
                  <UIActivityIndicator
                    // If we dont set the max height, the border takes up the entire screen
                    style={{maxHeight: SIDE_ICON_BUTTON_WIDTH}}
                    size={SIDE_ICON_BUTTON_WIDTH}
                    color={WHITE}
                  />
                ) : (
                  <MaterialIcon name="share" color={WHITE} size={36} />
                )}
              </Pressable>
            </View>
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
      <ErrorBottomSheet
        error={error || shareError}
        clearError={() => {
          clearError();
          setShareError(null);
        }}
        tryAgain={() => {
          clearError();
          setShareError(null);
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
