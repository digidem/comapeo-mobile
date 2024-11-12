import React from 'react';
import ChainIcon from '../../images/Chain.svg';

import {Observation} from '@comapeo/schema';
import {ObservationListItem} from '../ObservationsList/ObservationListItem.tsx';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {defineMessages, useIntl} from 'react-intl';
import {Accordian} from '../../sharedComponents/Accordian.tsx';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';

interface TrackObservation {
  observations: Observation[];
}

const m = defineMessages({
  observations: {
    id: 'screens.Track.ObservationList.observations',
    defaultMessage: 'Observations',
  },
});

export function ObservationList({observations}: TrackObservation) {
  const navigation = useNavigationFromRoot();
  const {formatMessage} = useIntl();

  return (
    <Accordian
      title={
        <>
          <HeaderText variant="header5">{observations.length}</HeaderText>
          <ChainIcon style={{marginRight: 10, marginLeft: 2}} />
          <HeaderText variant="header5">
            {formatMessage(m.observations)}
          </HeaderText>
        </>
      }
      innerAccordianDetails={observations.map((observation, index) => (
        <ObservationListItem
          key={index}
          observation={observation}
          onPress={() => {
            navigation.navigate('Observation', {
              observationId: observation.docId,
            });
          }}
          testID={'id' + index}
        />
      ))}
    />
  );
}
