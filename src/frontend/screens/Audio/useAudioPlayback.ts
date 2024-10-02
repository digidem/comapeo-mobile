import {Audio, AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';
import {useCallback, useEffect, useState, useRef} from 'react';
import {Sound} from 'expo-av/build/Audio/Sound';

export const useAudioPlayback = (recordingUri: string) => {
  const recordedSoundRef = useRef<Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState(0);

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
    let soundInstance: Sound | null = null;
    Audio.Sound.createAsync({uri: recordingUri})
      .then(({sound, status}) => {
        if ('error' in status && status.error) {
          console.error('Error while creating audio playback', status.error);
          return;
        }
        soundInstance = sound;
        recordedSoundRef.current = sound;
        setDuration((status as AVPlaybackStatusSuccess).durationMillis ?? 0);
        sound.setOnPlaybackStatusUpdate(audioCallbackHandler);
      })
      .catch(error => console.error('Error loading sound:', error));

    return () => {
      if (soundInstance) {
        soundInstance
          .unloadAsync()
          .catch(err => console.error('Unload error:', err));
      }
    };
  }, [recordingUri, audioCallbackHandler]);

  const startPlayback = useCallback(async () => {
    if (!recordedSoundRef.current || isPlaying) return;

    try {
      if (currentPosition >= duration) {
        await recordedSoundRef.current!.setPositionAsync(0);
        setCurrentPosition(0);
      }

      await recordedSoundRef.current!.playAsync();
      setPlaying(true);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }, [isPlaying, currentPosition, duration]);

  const stopPlayback = useCallback(async () => {
    if (!recordedSoundRef.current || !isPlaying) return;

    try {
      await recordedSoundRef.current!.pauseAsync();
      setPlaying(false);
    } catch (error) {
      console.error('Failed to pause sound:', error);
    }
  }, [isPlaying]);

  return {
    duration,
    isPlaying,
    currentPosition,
    startPlayback,
    stopPlayback,
  };
};
