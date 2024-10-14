import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {Duration} from 'luxon';
import {defineMessages, useIntl} from 'react-intl';
import {ContentWithControls} from '../screens/Audio/ContentWithControls';
import * as Controls from '../screens/Audio/Controls';
import {useAudioPlayback} from '../screens/Audio/useAudioPlayback';
import {ErrorBottomSheet} from '../sharedComponents/ErrorBottomSheet';

const m = defineMessages({
  description: {
    id: 'screens.AudioScreen.Playback.description',
    defaultMessage: 'Total length: {length}',
  },
});
export function Playback({
  uri,
  leftControl,
  rightControl,
}: {
  uri: string;
  isModalOpen?: boolean;
  leftControl?: ReactNode;
  rightControl?: ReactNode;
}) {
  const {formatMessage: t} = useIntl();
  const {
    duration,
    currentPosition,
    isPlaying,
    stopPlayback,
    startPlayback,
    hasError,
    clearError,
  } = useAudioPlayback(uri);
  return (
    <View style={{flex: 1}}>
      <ContentWithControls
        timeElapsed={currentPosition}
        message={t(m.description, {
          length: Duration.fromMillis(duration).toFormat('mm:ss'),
        })}
        progress={currentPosition / duration}
        controls={
          <>
            {leftControl && (
              <Controls.Side side="left">{leftControl}</Controls.Side>
            )}
            {isPlaying ? (
              <Controls.Stop onPress={stopPlayback} />
            ) : (
              <Controls.Play onPress={startPlayback} />
            )}
            {rightControl && (
              <Controls.Side side="right">{rightControl}</Controls.Side>
            )}
          </>
        }
      />
      <ErrorBottomSheet
        error={hasError ? new Error('An error occurred') : null}
        clearError={clearError}
        tryAgain={isPlaying ? stopPlayback : startPlayback}
      />
    </View>
  );
}
