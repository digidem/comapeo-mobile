import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {useAudioPlayback} from '../../hooks/useAudioPlayback';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {Bar} from 'react-native-progress';
import {
  COMAPEO_BLUE,
  WHITE,
  NEW_DARK_GREY,
  BLUE_GREY,
  VERY_LIGHT_GREY,
  BLACK,
} from '../../lib/styles';
import {StopIcon} from '../../sharedComponents/icons';
import PlayArrow from '../../images/PlayArrow.svg';
import {millisecondsToMMSS} from '../../lib/millisecondsToFormattedTime';
import {DateDistance} from '../../sharedComponents/DateDistance';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  recordingSaved: {
    id: 'screens.AudioPlaybackNew.recordingSaved',
    defaultMessage: 'Recording Saved!',
  },
  backToEditing: {
    id: 'screens.AudioPlaybackNew.backToEditing',
    defaultMessage: 'Back to Editing',
  },
  delete: {
    id: 'screens.AudioPlaybackNew.delete',
    defaultMessage: 'Delete',
  },
});

export const AudioPlaybackNew = ({
  navigation,
  route,
}: NativeRootNavigationProps<'AudioPlaybackNew'>) => {
  const {uri, createdAt} = route.params;
  const {duration, currentPosition, isPlaying, startPlayback, stopPlayback} =
    useAudioPlayback(uri);
  const {formatMessage} = useIntl();
  const {deleteAudio} = useDraftObservation();

  const progress = duration ? currentPosition / duration : 0;

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.container}
      dockContainerStyle={{gap: 20, backgroundColor: WHITE}}
      dockContent={
        <>
          <SecondaryButton
            fullSize
            text={formatMessage(m.backToEditing)}
            onPress={() => navigation.goBack()}
          />
          <DestructiveButton
            fullSize
            text={formatMessage(m.delete)}
            onPress={() => {
              deleteAudio(uri, false);
              navigation.goBack();
            }}
            renderIcon={({color, size}) => (
              <MaterialIcons name="delete" size={size} color={color} />
            )}
          />
        </>
      }>
      <BodyText variant="large" style={styles.savedHeader}>
        {formatMessage(m.recordingSaved)}
      </BodyText>

      <View style={styles.audioBox}>
        <TouchableOpacity
          onPress={() => (isPlaying ? stopPlayback() : startPlayback())}
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
          <HeaderText style={styles.durationText} variant="header3">
            {millisecondsToMMSS(isPlaying ? currentPosition : duration)}
          </HeaderText>
          <DateDistance
            date={new Date(createdAt)}
            style={styles.relativeTime}
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
  savedHeader: {
    paddingTop: 65,
    color: NEW_DARK_GREY,
    textAlign: 'center',
  },
  audioBox: {
    width: 300,
    height: 300,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    alignItems: 'center',
    gap: 30,
    paddingBottom: 40,
  },
  durationText: {
    textAlign: 'center',
  },
  relativeTime: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
  },
});
