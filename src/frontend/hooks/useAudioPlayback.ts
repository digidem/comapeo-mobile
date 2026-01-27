import {useAudioPlayer, useAudioPlayerStatus} from 'expo-audio';
import {useCallback} from 'react';
import {useNavigationFromRoot} from './useNavigationWithTypes';

export const useAudioPlayback = (recordingUri: string) => {
  const player = useAudioPlayer({uri: recordingUri});
  const status = useAudioPlayerStatus(player);
  const {navigate} = useNavigationFromRoot();

  const startPlayback = useCallback(async () => {
    if (!player || status.playing) return;

    if (
      status.currentTime &&
      status.duration &&
      status.currentTime >= status.duration
    ) {
      player.seekTo(0);
    }

    try {
      player.play();
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [player, status.playing, status.duration, status.currentTime, navigate]);

  const stopPlayback = useCallback(async () => {
    if (!player || !status.playing) return;

    try {
      player.pause();
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [player, status.playing, navigate]);

  return {
    duration: status.duration ? status.duration * 1000 : 0,
    isPlaying: status.playing,
    currentPosition: status.currentTime ? status.currentTime * 1000 : 0,
    startPlayback,
    stopPlayback,
  };
};
