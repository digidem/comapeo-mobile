import React, {useEffect} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {useDerivedValue, withTiming} from 'react-native-reanimated';

import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {AnimatedBackground} from '../AnimatedBackground';
import {ContentWithControls} from '../ContentWithControls';
import * as Controls from '../Controls';
import {MAX_RECORDING_DURATION_MS} from '../constants';

const m = defineMessages({
  description: {
    id: 'screens.AudioScreen.CreateRecording.RecordingActive.description',
    defaultMessage:
      'Less than {length} {length, plural, one {minute} other {minutes}} left',
  },
});

export function RecordingActive({
  duration,
  onPressStop,
}: {
  duration: number;
  onPressStop: () => void;
}) {
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();

  const minutesRemaining = Math.ceil(
    (MAX_RECORDING_DURATION_MS - duration) / 60_000,
  );

  const elapsedTimeValue = useDerivedValue(() => {
    return withTiming(duration, {duration: 500});
  }, [duration]);

  useEffect(() => {
    navigation.setOptions({headerLeft: () => null});
  }, [navigation]);

  // TODO: Maybe move this into the hook?
  useEffect(() => {
    if (minutesRemaining === 0) {
      // stopRecording();
      onPressStop();
    }
  }, [minutesRemaining, onPressStop]);

  return (
    <>
      <ContentWithControls
        timeElapsed={duration}
        message={
          minutesRemaining > 0
            ? t(m.description, {
                length: minutesRemaining,
              })
            : undefined
        }
        controls={
          <Controls.Row>
            <Controls.Stop onPress={onPressStop} />
          </Controls.Row>
        }
      />
      <AnimatedBackground elapsedTimeValue={elapsedTimeValue} />
    </>
  );
}
