import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FormattedPresetName} from '../../sharedComponents/FormattedData';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {Preset} from '@comapeo/schema';
import {ViewStyleProp} from '../../sharedTypes';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

export const PresetHeader = ({
  preset,
  style,
}: {
  preset?: Preset;
  style?: ViewStyleProp;
}) => {
  return (
    <View style={[styles.categoryIconContainer, style]}>
      <PresetCircleIcon
        size="medium"
        iconId={preset?.iconRef?.docId}
        testID={`OBS.${preset?.name}-view-icon`}
      />
      <HeaderText
        variant="header3"
        style={styles.categoryLabel}
        numberOfLines={1}>
        <FormattedPresetName preset={preset} />
      </HeaderText>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryIconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryLabel: {
    marginLeft: 10,
  },
});
