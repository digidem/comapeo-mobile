import {icon, preset} from '@mapeo/schema/dist/validations';
import {View, Text, StyleSheet} from 'react-native';
import {BLACK} from '../../lib/styles';
import {FormattedPresetName} from '../../sharedComponents/FormattedData';
import {CategoryCircleIcon} from '../../sharedComponents/icons/CategoryIcon';
import {usePresetQuery} from '../../hooks/server/usePresetQuery';
import {Loading} from '../../sharedComponents/Loading';

export const CategoryHeader = ({categoryId}: {categoryId: string}) => {
  const preset = usePresetQuery(categoryId);

  if (preset.isError) {
    return <></>;
  }
  if (preset.isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.categoryIconContainer}>
      <CategoryCircleIcon color={BLACK} size="medium" />
      <Text style={styles.categoryLabel} numberOfLines={1}>
        <FormattedPresetName preset={preset.data} />
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
