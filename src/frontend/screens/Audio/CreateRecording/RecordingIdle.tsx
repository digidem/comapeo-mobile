import React, {useEffect} from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';
import {CustomHeaderLeft} from '../../../sharedComponents/CustomHeaderLeft';
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
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();
  // const {startRecording} = useAudioRecordingActions();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <CustomHeaderLeft
          tintColor={props.tintColor}
          headerBackButtonProps={props}
        />
      ),
    });
  }, [navigation]);

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
