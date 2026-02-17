import React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {usePresetsSelection} from '@comapeo/core-react';
import {CategoryGrid} from './CategoryGrid';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeftClose} from '../../sharedComponents/CustomHeaderLeftClose';
import {Preset} from '@comapeo/schema';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';

const m = defineMessages({
  title: {
    id: 'screens.ObservationCategoryChooser.title',
    defaultMessage: 'Choose a category',
  },
});

export const ObservationCategoryChooser: NativeNavigationComponent<
  'ObservationCategoryChooser'
> = ({navigation}) => {
  const {projectId} = useActiveProject();
  const languageTag = useAppLanguageTag();
  const presets = usePresetsSelection({
    projectId: projectId,
    dataType: 'observation',
    lang: languageTag,
  });
  const preset = useDraftObservationState(state => state.value?.presetRef);
  const {updatePreset} = useDraftObservationActions();
  const observationId = useDraftObservationState(state => state.id?.docId);

  const filteredPresets = Array.from(presets).filter(p =>
    p.geometry.includes('point'),
  );

  const handleSelect = (preset: Preset) => {
    updatePreset(preset);
    if (observationId) {
      navigation.popTo('ObservationEdit');
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
        preset ? (
          <CustomHeaderLeft
            onPress={handleGoBack}
            headerBackButtonProps={props}
          />
        ) : (
          <CustomHeaderLeftClose
            headerBackButtonProps={props}
            observationId={observationId}
          />
        ),
    });
  }, [navigation, handleGoBack, observationId, preset]);

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
