import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {FormattedObservationDate} from '../../sharedComponents/FormattedData.tsx';
import {Track} from '@comapeo/schema';
import {ViewStyleProp} from '../../sharedTypes/index';
import {defineMessages, useIntl} from 'react-intl';
import TrackIcon from '../../images/Track.svg';

const m = defineMessages({
  track: {
    id: 'screens.ObservationList.TrackListItem.Track',
    defaultMessage: 'Track',
  },
});

interface ObservationListItemProps {
  style?: ViewStyleProp;
  track: Track;
  testID: string;
  onPress: () => void;
}

const TrackObservationItemNotMemoized = ({
  style,
  track,
  testID,
  onPress,
}: ObservationListItemProps) => {
  const {formatMessage} = useIntl();
  return (
    <TouchableHighlight
      onPress={onPress}
      testID={testID}
      style={styles.touchable}>
      <View style={[styles.container, style]}>
        <View style={styles.text}>
          <Text style={styles.title}>
            <Text>{formatMessage(m.track)}</Text>
          </Text>
          <Text>
            <FormattedObservationDate
              createdDate={track.createdAt}
              variant="relative"
            />
          </Text>
        </View>
        <TrackIcon />
      </View>
    </TouchableHighlight>
  );
};

export const TrackListItem = React.memo<ObservationListItemProps>(
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
  title: {fontSize: 18, fontWeight: '700', color: 'black'},
  touchable: {
    flex: 1,
    height: 80,
  },
});
