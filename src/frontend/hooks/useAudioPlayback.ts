import {Audio, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';
import {useCallback, useEffect, useState} from 'react';
import {Sound} from 'expo-av/build/Audio/Sound';
import {useSharedValue} from 'react-native-reanimated';

export const useAudioPlayback = (recordingUri: string) => {
  const [recordedSound, setRecordedSound] = useState<Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const currentPosition = useSharedValue<number>(0);
  const [isReady, setReady] = useState(false);

  const audioCallbackHandler = useCallback(
    (status: AVPlaybackStatus) => {
      'worklet';
      const update = status as AVPlaybackStatusSuccess;
      if (update.didJustFinish) {
        setPlaying(false);
        currentPosition.value = 0;
      } else {
        setPlaying(update.isPlaying);
        if (update.isPlaying) {
          currentPosition.value = update.positionMillis;
        }
      }
    },
    [currentPosition],
  );

  useEffect(() => {
    Audio.Sound.createAsync({
      uri: recordingUri,
    }).then(({sound, status}) => {
      if ('error' in status && status.error) {
        console.error('error while creating audio playback', status.error);
        return;
      }
      const successStatus = status as AVPlaybackStatusSuccess;
      setRecordedSound(sound);
      setDuration(successStatus.durationMillis!);
      setReady(true);
      sound.setOnPlaybackStatusUpdate(audioCallbackHandler);
    });
  }, [audioCallbackHandler, duration, recordingUri]);

  const startPlayback = async () => {
    if (!isReady) {
      console.warn(
        'startPlayback from useAudioPlayback called while recording is not ready',
      );
      return;
    }
    if (isPlaying) {
      console.warn(
        'startPlayback from useAudioPlayback called while player is already in playing state',
      );
      return;
    }
    await recordedSound!.replayAsync();
  };

  const stopPlayback = async () => {
    if (!isReady) {
      console.warn(
        'stopPlayback from useAudioPlayback called while recording is not ready',
      );
      return;
    }
    if (!isPlaying) {
      console.warn(
        'stopPlayback from useAudioPlayback called while player is not in playing state',
      );
      return;
    }
    await recordedSound!.stopAsync();
  };

  return {
    duration,
    isReady,
    isPlaying,
    currentPosition,
    startPlayback,
    stopPlayback,
  };
};
