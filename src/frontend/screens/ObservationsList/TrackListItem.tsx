import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {FormattedObservationDate} from '../../sharedComponents/FormattedData.tsx';
import {Track} from '@mapeo/schema';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon.tsx';
import {ViewStyleProp} from '../../sharedTypes/index';

interface ObservationListItemProps {
  style?: ViewStyleProp;
  track: Track;
  testID: string;
  onPress: (id: string) => void;
}

const TrackObservationItemNotMemoized = ({
  style,
  track,
  testID,
  onPress = () => {},
}: ObservationListItemProps) => {
  return (
    <TouchableHighlight
      onPress={() => onPress(track.docId)}
      testID={testID}
      style={{flex: 1, height: 80}}>
      <View style={[styles.container, style]}>
        <View style={styles.text}>
          <Text style={styles.title}>
            <Text>Track</Text>
          </Text>
          <Text>
            <FormattedObservationDate
              createdDate={track.createdAt}
              variant="relative"
            />
          </Text>
        </View>
        <PresetCircleIcon name={track.schemaName} size="medium" />
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
  photoContainer: {
    position: 'relative',
    marginRight: -5,
  },
  photo: {
    borderRadius: 5,
    overflow: 'hidden',
    position: 'absolute',
    width: 60,
    height: 60,
    top: 0,
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
  },
  smallIconContainer: {position: 'absolute', right: -3, bottom: -3},
});
