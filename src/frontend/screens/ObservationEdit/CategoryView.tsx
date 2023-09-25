import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import {BLACK, LIGHT_BLUE} from '../../lib/styles';
import {TextButton} from '../../sharedComponents/TextButton';
import {CategoryCircleIcon} from '../../sharedComponents/icons/CategoryIcon';
import {Preset} from '../../sharedTypes';

const m = defineMessages({
  observation: {
    // Keep id stable for translations
    id: 'screens.Observation.ObservationEdit.CategoryView.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
  changePreset: {
    id: 'screens.Observation.ObservationEdit.CategoryView.changePreset',
    defaultMessage: 'Change',
  },
});

export const CategoryView = ({
  preset,
  onPress,
}: {
  preset: Preset;
  onPress: () => void;
}) => {
  const {formatMessage: t} = useIntl();
  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryIcon}>
        <CategoryCircleIcon />
      </View>
      <Text style={styles.categoryName}>
        <FormattedPresetName preset={preset} />
      </Text>
      <TextButton
        containerStyle={styles.changeButton}
        textStyle={styles.changeButtonText}
        onPress={onPress}
        title={t(m.changePreset)}
      />
    </View>
  );
};

// Format the translated preset name, with a fallback to "Observation" if no
// preset is defined
export const FormattedPresetName = ({preset}: {preset: Preset}) => {
  const {formatMessage: t} = useIntl();
  const name = preset
    ? t({id: `presets.${preset.id}.name`, defaultMessage: preset.name})
    : t(m.observation);

  return <React.Fragment>{name}</React.Fragment>;
};

const styles = StyleSheet.create({
  categoryContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'stretch',
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  categoryIcon: {
    flex: 0,
  },
  categoryName: {
    color: BLACK,
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    flex: 1,
  },
  changeButton: {
    padding: 0,
  },
  changeButtonText: {
    color: LIGHT_BLUE,
    paddingTop: 5,
    fontSize: 12,
    fontWeight: '500',
  },
});
