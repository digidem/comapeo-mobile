import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ContentWithControls} from '../ContentWithControls';
import * as Controls from '../Controls';
import {MAX_RECORDING_DURATION_MS} from '../constants';

const m = defineMessages({
  description: {
    id: 'screens.AudioScreen.CreateRecording.RecordingIdle.description',
    defaultMessage:
      'Record up to {length} {length, plural, one {minute} other {minutes}}',
  },
});

export function RecordingIdle({onPressRecord}: {onPressRecord: () => void}) {
  const {formatMessage: t} = useIntl();

  return (
    <ContentWithControls
      message={t(m.description, {
        length: MAX_RECORDING_DURATION_MS / 60_000,
      })}
      timeElapsed={0}
      controls={
        <Controls.Row>
          <Controls.Record onPress={onPressRecord} />
        </Controls.Row>
      }
    />
  );
}
