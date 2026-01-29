import {useAudioPlayer, useAudioPlayerStatus} from 'expo-audio';

export const useAudioPlayback = (recordingUri: string) => {
  const player = useAudioPlayer({uri: recordingUri});
  const status = useAudioPlayerStatus(player);

  const startPlayback = () => {
    if (status.playing) return;

    if (status.currentTime >= status.duration) {
      player.seekTo(0);
    }

    player.play();
  };

  const stopPlayback = () => {
    if (!status.playing) return;
    player.pause();
  };

  return {
    player,
    status,
    duration: status.duration * 1000,
    isPlaying: status.playing,
    currentPosition: status.currentTime * 1000,
    startPlayback,
    stopPlayback,
  };
};
