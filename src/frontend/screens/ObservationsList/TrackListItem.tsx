import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FormattedObservationDate} from '../../sharedComponents/FormattedData.tsx';
import {Track} from '@comapeo/schema';
import {ViewStyleProp} from '../../sharedTypes/index';
import {defineMessages, useIntl} from 'react-intl';
import TrackIcon from '../../images/Track.svg';
import {sharedStyles} from './SharedStyle.ts';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePresetsQuery} from '../../hooks/server/presets.ts';

const m = defineMessages({
  track: {
    id: 'screens.ObservationList.TrackListItem.Track',
    defaultMessage: 'Track',
  },
});

interface TrackListItemProps {
  style?: ViewStyleProp;
  track: Track;
  testID: string;
  onPress: () => void;
  showSyncedIndicator?: boolean;
}

const TrackObservationItemNotMemoized = ({
  style,
  track,
  testID,
  onPress,
  showSyncedIndicator,
}: TrackListItemProps) => {
  const {formatMessage} = useIntl();
  const {data: allPresets} = usePresetsQuery();
  const matchedPreset =
    track.presetRef && allPresets.find(p => p.docId === track.presetRef?.docId);

  const icon = matchedPreset ? (
    <PresetCircleIcon iconId={matchedPreset.iconRef?.docId} size="medium" />
  ) : (
    <TrackIcon />
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      testID={testID}
      style={styles.touchable}>
      <View
        style={[
          styles.container,
          style,
          showSyncedIndicator && sharedStyles.synced,
        ]}>
        <View style={styles.text}>
          <HeaderText variant="header4">{formatMessage(m.track)}</HeaderText>
          <BodyText>
            <FormattedObservationDate
              createdDate={track.createdAt}
              variant="relative"
            />
          </BodyText>
        </View>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export const TrackListItem = React.memo<TrackListItemProps>(
  TrackObservationItemNotMemoized,
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    width: '100%',
    paddingHorizontal: 15,
    flex: 1,
    height: 80,
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  touchable: {
    flex: 1,
    height: 80,
  },
});
