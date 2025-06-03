import React from 'react';
import {StyleSheet, View, TouchableOpacity, Pressable} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useAudioPlayback} from '../../hooks/useAudioPlayback';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {Bar} from 'react-native-progress';
import {
  COMAPEO_BLUE,
  WHITE,
  VERY_LIGHT_GREY,
  BLACK,
  NEW_DARK_GREY,
  BLUE_GREY,
} from '../../lib/styles';
import {StopIcon} from '../../sharedComponents/icons';
import PlayArrow from '../../images/PlayArrow.svg';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import * as FileSystem from 'expo-file-system';
import Share from 'react-native-share';
import {UIActivityIndicator} from 'react-native-indicators';
import {SIDE_ICON_BUTTON_WIDTH} from '../../screens/Audio/shared';
import * as Sentry from '@sentry/react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {FormattedObservationDate} from '../../sharedComponents/FormattedData';
import {useAttachmentUrl} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

const m = defineMessages({
  navTitle: {
    id: 'screens.AudioAttachmentPlayback.navTitle',
    defaultMessage: 'Audio Recording',
  },
  share: {
    id: 'screens.AudioAttachmentPlayback.share',
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
  const {duration, currentPosition, isPlaying, startPlayback, stopPlayback} =
    useAudioPlayback(uri);
  const {formatMessage} = useIntl();
  const [localUri, setLocalUri] = React.useState<string | null>(null);
  const [shareLoading, setShareLoading] = React.useState(false);

  const progress = duration ? currentPosition / duration : 0;

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
      navigation.navigate('ErrorBottomSheet');
      Sentry.captureException(err);
    } finally {
      setShareLoading(false);
    }
  }, [uri, localUri, navigation]);

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
          <UIActivityIndicator
            style={{maxHeight: SIDE_ICON_BUTTON_WIDTH}}
            size={SIDE_ICON_BUTTON_WIDTH}
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
      <View style={styles.audioBox}>
        <TouchableOpacity
          onPress={() => (isPlaying ? stopPlayback() : startPlayback())}
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

        <HeaderText style={styles.durationText} variant="header3">
          {millisecondsToMMSS(currentPosition)} / {millisecondsToMMSS(duration)}
        </HeaderText>

        <BodyText variant="smallMeta" style={styles.dateRecorded}>
          <FormattedObservationDate createdDate={createdAt} variant="long" />
        </BodyText>
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
  audioBox: {
    width: 300,
    height: 300,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 30,
  },
  playButton: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  durationText: {
    textAlign: 'center',
  },
  dateRecorded: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
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
