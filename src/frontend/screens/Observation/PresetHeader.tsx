import {View, Text, StyleSheet} from 'react-native';
import {BLACK} from '../../lib/styles';
import {FormattedPresetName} from '../../sharedComponents/FormattedData';
import {CategoryCircleIcon} from '../../sharedComponents/icons/CategoryIcon';
import {Preset} from '@mapeo/schema';

export const PresetHeader = ({preset}: {preset: Preset}) => {
  return (
    <View style={styles.categoryIconContainer}>
      <CategoryCircleIcon color={BLACK} size="medium" />
      <Text style={styles.categoryLabel} numberOfLines={1}>
        <FormattedPresetName preset={preset} />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryIconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryLabel: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
  },
});
