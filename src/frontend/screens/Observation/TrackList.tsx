import React from 'react';
import ChainIcon from '../../images/Chain.svg';
import {Track} from '@comapeo/schema';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {defineMessages, useIntl} from 'react-intl';
import {Accordian} from '../../sharedComponents/Accordian.tsx';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import {TrackListItem} from '../ObservationsList/TrackListItem.tsx';

interface TrackListProps {
  track: Track;
}

const m = defineMessages({
  track: {
    id: 'screens.Observation.TrackList.track',
    defaultMessage: 'Track',
  },
});

export function TrackList({track}: TrackListProps) {
  const navigation = useNavigationFromRoot();
  const {formatMessage} = useIntl();

  return (
    <Accordian
      style={{padding: 20}}
      title={
        <>
          <HeaderText variant="header5">{1}</HeaderText>
          <ChainIcon style={{marginRight: 10, marginLeft: 2}} />
          <HeaderText variant="header5">{formatMessage(m.track)}</HeaderText>
        </>
      }
      innerAccordianDetails={
        <TrackListItem
          track={track}
          onPress={() => {
            navigation.navigate('Track', {trackId: track.docId});
          }}
          testID={`trackListItem:${track.docId}`}
        />
      }
    />
  );
}
