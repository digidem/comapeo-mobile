import React from 'react';
import {StyleSheet, View, TouchableOpacity, Pressable} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useAudioPlayer, useAudioPlayerStatus} from 'expo-audio';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {Bar} from 'react-native-progress';
import {
  COMAPEO_BLUE,
  WHITE,
  VERY_LIGHT_GREY,
  BLACK,
  BLUE_GREY,
} from '../../lib/styles';
import {StopIcon} from '../../sharedComponents/icons';
import PlayArrow from '../../images/PlayArrow.svg';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import * as FileSystem from 'expo-file-system/legacy';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import {useOpenShareDialog} from '../../hooks/share';
import {audioStyles, SIDE_ICON_BUTTON_WIDTH} from '../../screens/Audio/shared';
import * as Sentry from '@sentry/react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {toError} from '../../utils/errors';
import {FormattedObservationDate} from '../../sharedComponents/FormattedData';
import {useAttachmentUrl} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

const m = defineMessages({
  navTitle: {
    id: 'screens.AudioAttachmentPlayback.navTitle',
    defaultMessage: 'Audio Recording',
  },
  share: {
    id: '$1screens.AudioAttachmentPlayback.share',
    defaultMessage: 'Share',
  },
});

export const AudioAttachmentPlaybackScreen = ({
  route,
  navigation,
}: NativeRootNavigationProps<'AudioAttachmentPlaybackScreen'>) => {
  const {driveDiscoveryId, name, type, createdAt} = route.params;

  const {projectId} = useActiveProject();

  const {data: uri} = useAttachmentUrl({
    projectId,
    blobId: {
      driveId: driveDiscoveryId,
      name,
      type,
      variant: 'original',
    },
  });
  const player = useAudioPlayer({uri});
  const status = useAudioPlayerStatus(player);
  const {formatMessage} = useIntl();
  const [localUri, setLocalUri] = React.useState<string | null>(null);
  const {mutate: openShareDialog, isPending: shareLoading} =
    useOpenShareDialog();

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

  const handleShare = React.useCallback(async () => {
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

      openShareDialog(
        {url: fileUri, failOnCancel: false},
        {
          onError: err => {
            Sentry.captureException(err);
            navigation.navigate('ErrorBottomSheet', {
              error: toError(err, 'Error sharing audio'),
            });
          },
        },
      );
    } catch (err) {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet', {
        error: toError(err, 'Error sharing audio'),
      });
    }
  }, [uri, localUri, navigation, openShareDialog]);

  React.useEffect(() => {
    return () => {
      if (localUri) {
        FileSystem.deleteAsync(localUri, {idempotent: true}).catch(() => {});
      }
    };
  }, [localUri]);

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.container}
      dockContainerStyle={styles.dockContainer}
      dockContent={
        shareLoading ? (
          <LoadingIndicator
            style={{maxHeight: SIDE_ICON_BUTTON_WIDTH}}
            size="large"
            color={WHITE}
          />
        ) : (
          <Pressable
            accessibilityLabel="Share audio."
            onPress={handleShare}
            style={styles.shareButton}>
            <View style={styles.shareCircle}>
              <MaterialIcon name="share" color={BLACK} size={24} />
            </View>
            <BodyText variant="tinyMeta" style={styles.shareLabel}>
              {formatMessage(m.share)}
            </BodyText>
          </Pressable>
        )
      }>
      <View style={audioStyles.audioBox}>
        <TouchableOpacity
          testID="audio-play-toggle"
          onPress={handlePlayPause}
          style={styles.playButton}>
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

        <HeaderText style={{textAlign: 'center'}} variant="header3">
          {millisecondsToMMSS(currentPosition)} / {millisecondsToMMSS(duration)}
        </HeaderText>

        {createdAt && (
          <BodyText variant="smallMeta" style={audioStyles.textStyle}>
            <FormattedObservationDate createdDate={createdAt} variant="long" />
          </BodyText>
        )}
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    flex: 1,
  },
  dockContainer: {
    backgroundColor: WHITE,
    paddingBottom: 20,
  },
  playButton: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  shareButton: {
    width: 60,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareLabel: {
    color: BLACK,
    marginTop: 4,
  },
});

AudioAttachmentPlaybackScreen.navTitle = m.navTitle;
