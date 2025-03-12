import {Audio, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';
import {useCallback, useEffect, useState, useRef} from 'react';
import {Sound} from 'expo-av/build/Audio/Sound';
import {useNavigationFromRoot} from './useNavigationWithTypes';

export const useAudioPlayback = (recordingUri: string) => {
  const recordedSoundRef = useRef<Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const {navigate} = useNavigationFromRoot();

  // const handleError = useCallback(
  //   (err: unknown) => {
  //     const newError =
  //       err instanceof Error ? err : new Error('An unknown error occurred');
  //     navigate('ErrorBottomSheet', {errorMessage: newError.message});
  //   },
  //   [navigate],
  // );

  const audioCallbackHandler = useCallback((status: AVPlaybackStatus) => {
    const update = status as AVPlaybackStatusSuccess;
    if (update.didJustFinish) {
      setPlaying(false);
      setCurrentPosition(update.durationMillis ?? 0);
    } else {
      setPlaying(update.isPlaying);
      if (update.isPlaying) {
        setCurrentPosition(update.positionMillis);
      }
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    Audio.Sound.createAsync({uri: recordingUri})
      .then(({sound, status}) => {
        if (isCancelled) {
          sound.unloadAsync().catch(() => {});
          return;
        }
        recordedSoundRef.current = sound;
        setDuration((status as AVPlaybackStatusSuccess).durationMillis ?? 0);
        sound.setOnPlaybackStatusUpdate(audioCallbackHandler);
      })
      .catch(() => {
        if (!isCancelled) {
          navigate('ErrorBottomSheet');
        }
      });

    return () => {
      isCancelled = true;
      if (recordedSoundRef.current) {
        recordedSoundRef.current.unloadAsync();
        recordedSoundRef.current = null;
      }
    };
  }, [recordingUri, audioCallbackHandler, navigate]);

  const startPlayback = useCallback(async () => {
    if (!recordedSoundRef.current || isPlaying) return;

    try {
      if (currentPosition >= duration) {
        await recordedSoundRef.current.setPositionAsync(0);
        setCurrentPosition(0);
      }

      await recordedSoundRef.current.playAsync();
      setPlaying(true);
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [isPlaying, currentPosition, duration, navigate]);

  const stopPlayback = useCallback(async () => {
    if (!recordedSoundRef.current || !isPlaying) return;

    try {
      await recordedSoundRef.current!.pauseAsync();
      setPlaying(false);
    } catch {
      navigate('ErrorBottomSheet');
    }
  }, [isPlaying, navigate]);

  return {
    duration,
    isPlaying,
    currentPosition,
    startPlayback,
    stopPlayback,
  };
};
