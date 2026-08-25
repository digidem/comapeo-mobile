import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {useAudioPlayer, useAudioPlayerStatus} from 'expo-audio';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {Bar} from 'react-native-progress';
import {COMAPEO_BLUE, WHITE, VERY_LIGHT_GREY, BLACK} from '../../lib/styles';
import {StopIcon} from '../../sharedComponents/icons';
import PlayArrow from '../../images/PlayArrow.svg';
import Ionicons from '@react-native-vector-icons/ionicons';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {DateDistance} from '../../sharedComponents/DateDistance';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {audioStyles} from './shared';
import {useDraftObservationActions} from '../../contexts/DraftObservationContext';
import * as Sentry from '@sentry/react-native';
import {toError} from '../../utils/errors';

const m = defineMessages({
  recordingSaved: {
    id: '$1screens.AudioPlaybackNew.recordingSaved',
    defaultMessage: 'Recording Saved!',
  },
  done: {
    id: '$1screens.AudioPlaybackNew.done',
    defaultMessage: 'Done',
  },
  delete: {
    id: '$1screens.AudioPlaybackNew.delete',
    defaultMessage: 'Delete',
  },
});

export const AudioDraftPlaybackScreen = ({
  navigation,
  route,
}: NativeRootNavigationProps<'AudioDraftPlaybackScreen'>) => {
  const {uri, createdAt, showRecordingSavedText, audioId} = route.params;
  const player = useAudioPlayer({uri});
  const status = useAudioPlayerStatus(player);
  const {formatMessage} = useIntl();
  const {deleteUnsavedAttachment} = useDraftObservationActions();

  const duration = status.duration * 1000;
  const currentPosition = status.currentTime * 1000;
  const isPlaying = status.playing;

  const handlePlayPause = () => {
    try {
      if (isPlaying) {
        player.pause();
      } else {
        if (status.currentTime >= status.duration) {
          player.seekTo(0);
        }
        player.play();
      }
    } catch (error) {
      Sentry.captureException(error);
      navigation.navigate('ErrorBottomSheet', {
        error: toError(error, 'Audio playback failed'),
      });
    }
  };

  const progress = duration ? currentPosition / duration : 0;

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.container}
      dockContainerStyle={{gap: 20, backgroundColor: WHITE}}
      dockContent={
        <>
          <DestructiveButton
            fullSize
            text={formatMessage(m.delete)}
            onPress={() => {
              deleteUnsavedAttachment(audioId);
              navigation.goBack();
            }}
            renderIcon={({color, size}) => (
              <MaterialIcons name="delete" size={size} color={color} />
            )}
          />
          <SecondaryButton
            fullSize
            text={formatMessage(m.done)}
            onPress={() => navigation.goBack()}
            renderIcon={({color, size}) => (
              <Ionicons
                name="checkmark-circle-outline"
                color={color}
                size={size}
              />
            )}
          />
        </>
      }>
      <View style={{paddingTop: 65}}>
        {showRecordingSavedText && (
          <BodyText variant="large" style={audioStyles.textStyle}>
            {formatMessage(m.recordingSaved)}
          </BodyText>
        )}
      </View>
      <View style={audioStyles.audioBox}>
        <TouchableOpacity
          onPress={handlePlayPause}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          {isPlaying ? <StopIcon size={60} color={BLACK} /> : <PlayArrow />}
        </TouchableOpacity>
        <Bar
          progress={progress > 0 ? progress : 0.00000001}
          width={200}
          height={6}
          color={COMAPEO_BLUE}
          unfilledColor={VERY_LIGHT_GREY}
          borderRadius={20}
          borderWidth={0}
        />
        <View>
          <HeaderText style={{textAlign: 'center'}} variant="header3">
            {millisecondsToMMSS(
              currentPosition > 0 ? currentPosition : duration,
            )}
          </HeaderText>
          <DateDistance
            date={new Date(createdAt)}
            style={audioStyles.textStyle}
          />
        </View>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    alignItems: 'center',
    gap: 30,
    flex: 1,
  },
});
