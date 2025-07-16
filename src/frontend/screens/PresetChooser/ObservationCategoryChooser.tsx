import React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {usePresetsQuery} from '../../hooks/server/presets';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {CategoryGrid} from './CategoryGrid';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeftClose} from '../../sharedComponents/CustomHeaderLeftClose';
import {Preset} from '@comapeo/schema';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';

const m = defineMessages({
  title: {
    id: 'screens.ObservationCategoryChooser.title',
    defaultMessage: 'Choose a category',
  },
});

export const ObservationCategoryChooser: NativeNavigationComponent<
  'ObservationCategoryChooser'
> = ({navigation}) => {
  const {data: presets} = usePresetsQuery();
  const {updatePreset, usePreset} = useDraftObservation();
  const observationId = usePersistedDraftObservation(
    state => state.observationId,
  );
  const currentPreset = usePreset();

  const filteredPresets = Array.from(presets)
    .filter(p => p.geometry.includes('point'))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const handleSelect = (preset: Preset) => {
    updatePreset(preset);
    if (observationId) {
      navigation.navigate('ObservationEdit', {observationId});
    } else {
      navigation.navigate('ObservationCreate');
    }
  };

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: m.title.defaultMessage,
      headerLeft: props =>
        currentPreset ? (
          <CustomHeaderLeft
            onPress={handleGoBack}
            headerBackButtonProps={props}
          />
        ) : (
          <CustomHeaderLeftClose headerBackButtonProps={props} />
        ),
    });
  }, [navigation, currentPreset, handleGoBack]);

  return (
    <View style={styles.container} testID="MAIN.categories-scrn">
      <CategoryGrid presets={filteredPresets} onSelect={handleSelect} />
    </View>
  );
};

ObservationCategoryChooser.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
});
