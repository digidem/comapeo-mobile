import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BLACK} from '../../lib/styles';
import {FormattedPresetName} from '../../sharedComponents/FormattedData';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {Preset} from '@mapeo/schema';

export const PresetHeader = ({preset}: {preset: Preset}) => {
  return (
    <View style={styles.categoryIconContainer}>
      <PresetCircleIcon
        size="medium"
        presetDocId={preset?.iconRef?.docId}
        testID={`OBS.${preset?.name}-view-icon`}
      />
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
