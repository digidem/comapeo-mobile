import React from 'react';
import ChainIcon from '../../images/Chain.svg';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {defineMessages, useIntl} from 'react-intl';
import {Accordian} from '../../sharedComponents/Accordian.tsx';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import {TrackListItem} from '../ObservationsList/TrackListItem.tsx';
import {useTracks} from '../../hooks/server/track.ts';
import {View} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles.ts';
import {findAssociatedTrack} from './findAssociatedTrack.ts';
import {useOwnDeviceInfo} from '@comapeo/core-react';

const m = defineMessages({
  track: {
    id: '$1screens.Observation.TrackList.track',
    defaultMessage: 'Track',
  },
});

export function TrackAccordian({observationId}: {observationId: string}) {
  const navigation = useNavigationFromRoot();
  const {data: deviceInfo} = useOwnDeviceInfo();
  const {data: allTracks} = useTracks();
  const track =
    allTracks === undefined
      ? undefined
      : findAssociatedTrack({tracks: allTracks, observationId});
  const {formatMessage} = useIntl();

  if (!track) return null;

  return (
    <View
      style={{
        marginTop: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: LIGHT_GREY,
      }}>
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
              navigation.push('Track', {trackId: track.docId});
            }}
            testID={`trackListItem:${track.docId}`}
            showSyncedIndicator={deviceInfo.deviceId !== track.createdBy}
          />
        }
      />
    </View>
  );
}
