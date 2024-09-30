import {Audio, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';
import {useCallback, useEffect, useState, useRef} from 'react';
import {Sound} from 'expo-av/build/Audio/Sound';

export const useAudioPlayback = (recordingUri: string) => {
  const recordedSoundRef = useRef<Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isReady, setReady] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const isPlayingRef = useRef(false);

  const audioCallbackHandler = useCallback((status: AVPlaybackStatus) => {
    const update = status as AVPlaybackStatusSuccess;
    if (update.didJustFinish) {
      setPlaying(false);
      setHasFinished(true);
      setCurrentPosition(update.durationMillis ?? 0);
    } else {
      setPlaying(update.isPlaying);
      if (update.isPlaying) {
        setCurrentPosition(update.positionMillis);
        setHasFinished(false);
      }
    }
  }, []);

  useEffect(() => {
    let soundInstance: Sound | null = null;
    Audio.Sound.createAsync({uri: recordingUri})
      .then(({sound, status}) => {
        if ('error' in status && status.error) {
          console.error('Error while creating audio playback', status.error);
          return;
        }
        soundInstance = sound;
        recordedSoundRef.current = sound;
        const successStatus = status as AVPlaybackStatusSuccess;
        setDuration(successStatus.durationMillis ?? 0);
        setReady(true);
        sound.setOnPlaybackStatusUpdate(audioCallbackHandler);
      })
      .catch(error => console.error('Error loading sound:', error));

    return () => {
      if (recordedSoundRef.current && !isPlayingRef.current) {
        recordedSoundRef.current
          .unloadAsync()
          .catch(err => console.error('Unload error:', err));
      }
    };
  }, [recordingUri]);

  const startPlayback = async () => {
    if (isPlayingRef.current || !isReady) {
      console.warn('Playback is already in progress or not ready');
      return;
    }
    isPlayingRef.current = true;
    try {
      const status = await recordedSoundRef.current!.getStatusAsync();
      if (hasFinished || status.positionMillis >= status.durationMillis) {
        await recordedSoundRef.current!.setPositionAsync(0);
        setCurrentPosition(0);
        setHasFinished(false);
      }

      await recordedSoundRef.current!.playAsync();
      const newStatus = await recordedSoundRef.current!.getStatusAsync();
      if (!newStatus.isLoaded) {
        console.error('Playback failed - Sound is not loaded!');
      }
    } catch (error) {
      console.error('Failed to play sound:', error);
    } finally {
      isPlayingRef.current = false;
    }
  };

  const stopPlayback = async () => {
    if (isPlayingRef.current || !isReady || !isPlaying) {
      console.warn('Playback is not in progress or not ready to stop');
      return;
    }
    isPlayingRef.current = true;
    try {
      await recordedSoundRef.current!.pauseAsync();
    } catch (error) {
      console.error('Failed to stop sound:', error);
    } finally {
      isPlayingRef.current = false;
    }
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
