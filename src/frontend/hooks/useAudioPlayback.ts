import {useAudioPlayer, useAudioPlayerStatus} from 'expo-audio';
import {useCallback, useEffect, useState, useRef} from 'react';
import {useNavigationFromRoot} from './useNavigationWithTypes';

export const useAudioPlayback = (recordingUri: string) => {
  const player = useAudioPlayer({uri: recordingUri});
  const status = useAudioPlayerStatus(player);
  const [isPlaying, setPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const lastPositionRef = useRef(0);
  const {navigate} = useNavigationFromRoot();

  useEffect(() => {
    if (status.playing !== isPlaying) {
      setPlaying(status.playing);
    }

    if (status.playing && status.currentTime !== undefined) {
      const positionMs = status.currentTime * 1000;
      setCurrentPosition(positionMs);
      lastPositionRef.current = positionMs;
    }

    if (status.didJustFinish && !status.playing) {
      setPlaying(false);
      if (status.duration) {
        const endPositionMs = status.duration * 1000;
        setCurrentPosition(endPositionMs);
        lastPositionRef.current = endPositionMs;
      }
    }
  }, [
    status.playing,
    status.currentTime,
    status.didJustFinish,
    status.duration,
    isPlaying,
  ]);

  const startPlayback = useCallback(async () => {
    if (!player || isPlaying) return;

    const duration = status.duration || 0;
    const currentTime = status.currentTime || 0;

    if (currentTime >= duration && duration > 0) {
      player.seekTo(0);
      setCurrentPosition(0);
      lastPositionRef.current = 0;
    }

    try {
      player.play();
      setPlaying(true);
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [player, isPlaying, status.duration, status.currentTime, navigate]);

  const stopPlayback = useCallback(async () => {
    if (!player || !isPlaying) return;

    try {
      player.pause();
    } catch {
      navigate('ErrorBottomSheet');
      return;
    }

    setPlaying(false);
    setCurrentPosition(lastPositionRef.current);
  }, [player, isPlaying, navigate]);

  return {
    duration: status.duration ? status.duration * 1000 : 0,
    isPlaying,
    currentPosition,
    startPlayback,
    stopPlayback,
  };
};
