import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {View, Text, StyleSheet} from 'react-native';
import {BLACK, LIGHT_BLUE} from '../../lib/styles';
import {TextButton} from '../../sharedComponents/TextButton';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDraftObservation} from '../../hooks/useDraftObservation';

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

export const PresetView = () => {
  const {formatMessage: t} = useIntl();
  const {navigate} = useNavigationFromRoot();
  const {usePreset} = useDraftObservation();
  const preset = usePreset();
  const name = preset
    ? t({id: `presets.${preset.docId}.name`, defaultMessage: preset.name})
    : t(m.observation);

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryIcon}>
        <PresetCircleIcon name={preset?.name} />
      </View>
      <Text style={styles.categoryName}>{name}</Text>
      <TextButton
        containerStyle={styles.changeButton}
        textStyle={styles.changeButtonText}
        onPress={() =>
          navigate({
            key: 'fromObservationEdit',
            name: 'PresetChooser',
          })
        }
        title={t(m.changePreset)}
      />
    </View>
  );
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
