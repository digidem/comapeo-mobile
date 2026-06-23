import React from 'react';
import ChainIcon from '../../images/Chain.svg';

import {Observation} from '@comapeo/schema';
import {ObservationListItem} from '../ObservationsList/ObservationListItem.tsx';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {defineMessages, useIntl} from 'react-intl';
import {Accordian} from '../../sharedComponents/Accordian.tsx';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import {usePresetsQuery} from '../../hooks/server/presets.ts';
import {useIsMyDocument} from '../../hooks/server/useIsMyDocument.ts';
import {matchPreset} from '../../lib/utils.ts';

interface TrackObservation {
  observations: Observation[];
}

const m = defineMessages({
  observations: {
    id: '$1screens.Track.ObservationList.observations',
    defaultMessage: 'Observations',
  },
  observation: {
    id: '$1screens.Track.ObservationList.observation',
    defaultMessage: 'Observation',
  },
});

export function ObservationList({observations}: TrackObservation) {
  const navigation = useNavigationFromRoot();
  const {formatMessage} = useIntl();
  const {data: allPresets} = usePresetsQuery();
  const numberOfObservations = observations.length;

  return (
    <Accordian
      style={{padding: 20}}
      title={
        <>
          <HeaderText variant="header5">{numberOfObservations}</HeaderText>
          <ChainIcon style={{marginRight: 10, marginLeft: 2}} />
          <HeaderText variant="header5">
            {formatMessage(
              numberOfObservations === 1 ? m.observation : m.observations,
            )}
          </HeaderText>
        </>
      }
      innerAccordianDetails={observations.map((observation, index) => (
        <TrackObservationListItem
          key={observation.docId}
          observation={observation}
          allPresets={allPresets}
          onPress={() => {
            navigation.push('Observation', {
              observationId: observation.docId,
            });
          }}
          testID={'id' + index}
        />
      ))}
    />
  );
}

function TrackObservationListItem({
  observation,
  allPresets,
  onPress,
  testID,
}: {
  observation: Observation;
  allPresets: ReturnType<typeof usePresetsQuery>['data'];
  onPress: () => void;
  testID: string;
}) {
  const isMine = useIsMyDocument(observation.originalVersionId);
  return (
    <ObservationListItem
      observation={observation}
      preset={matchPreset(observation.tags, allPresets)}
      isMine={isMine}
      onPress={onPress}
      testID={testID}
    />
  );
}
