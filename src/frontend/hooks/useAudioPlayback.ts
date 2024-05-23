import {Audio, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';
import {useEffect, useState} from 'react';
import {Sound} from 'expo-av/build/Audio/Sound';

export const useAudioPlayback = (recordingUri: string) => {
  const [recordedSound, setRecordedSound] = useState<Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isReady, setReady] = useState(false);

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
  }, [recordingUri]);

  const audioCallbackHandler = (status: AVPlaybackStatus) => {
    const update = status as AVPlaybackStatusSuccess;
    if (update.didJustFinish) {
      setPlaying(false);
      setCurrentPosition(0);
    } else {
      setPlaying(update.isPlaying);
      if (update.isPlaying) {
        setCurrentPosition(update.positionMillis);
      }
    }
  };

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
