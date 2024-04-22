import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {
  FormattedObservationDate,
  FormattedPresetName,
} from '../../../sharedComponents/FormattedData';
import {ViewStyleProp} from '../../../sharedTypes';
import {Observation} from '@mapeo/schema';
import {useObservationWithPreset} from '../../../hooks/useObservationWithPreset';
import {CategoryCircleIcon} from '../../../sharedComponents/icons/CategoryIcon';
import {BLACK} from '../../../lib/styles';

interface ObservationListItemProps {
  style?: ViewStyleProp;
  observation: Observation;
  testID: string;
  onPress: (id: string) => void;
}

const TrackObservationItemNotMemoized = ({
  style,
  observation,
  testID,
  onPress = () => {},
}: ObservationListItemProps) => {
  const {preset} = useObservationWithPreset(observation.docId);
  const iconId = '';
  const iconColor = BLACK;

  return (
    <TouchableHighlight
      onPress={() => onPress(observation.docId)}
      testID={testID}
      style={{flex: 1, height: 80}}>
      <View style={[styles.container, style]}>
        <View style={styles.text}>
          {preset && (
            <Text style={styles.title}>
              <FormattedPresetName preset={preset} />
            </Text>
          )}
          <Text>
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="relative"
            />
          </Text>
        </View>
        <CategoryCircleIcon iconId={iconId} color={iconColor} size="medium" />
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
