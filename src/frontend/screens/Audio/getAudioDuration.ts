import {Audio} from 'expo-av';

export async function getAudioDuration(uri: string): Promise<number> {
  try {
    const {sound, status} = await Audio.Sound.createAsync({uri});
    const duration = status.isLoaded ? status.durationMillis ?? 0 : 0;
    await sound.unloadAsync();
    return duration;
  } catch (error) {
    return 0;
  }
}
