import {useEffect} from 'react';

export function useAutoStopRecording(
  minutesRemaining: number,
  onPressStop: () => void,
) {
  useEffect(() => {
    if (minutesRemaining === 0) {
      onPressStop();
    }
  }, [minutesRemaining, onPressStop]);
}
