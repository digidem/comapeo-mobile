import React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {usePresetsQuery} from '../../hooks/server/presets';
import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {CategoryGrid} from './CategoryGrid';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {WHITE} from '../../lib/styles';
import {HeaderLeft} from '../SaveTrack/HeaderLeft';
import {Preset} from '@comapeo/schema';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';

const m = defineMessages({
  title: {
    id: 'screens.TrackCategoryChooser.title',
    defaultMessage: 'Choose a category',
  },
});

export const TrackCategoryChooser: NativeNavigationComponent<
  'TrackCategoryChooser'
> = ({navigation}) => {
  const {data: presets} = usePresetsQuery();
  const {setTrackPreset} = useTrackActions();
  const trackPresets = Array.from(presets)
    .filter(p => p.geometry.includes('line'))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const existingPreset = useTrackState(state => state.preset);
  const trackId = useTrackState(state => state.docId);

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelect = (preset: Preset) => {
    setTrackPreset(preset);
    if (trackId) {
      navigation.navigate('TrackEdit', {trackId});
    } else {
      navigation.navigate('SaveTrack');
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props =>
        existingPreset || trackId ? (
          <CustomHeaderLeft
            onPress={handleGoBack}
            headerBackButtonProps={props}
          />
        ) : (
          <HeaderLeft headerBackButtonProps={props} />
        ),
    });
  }, [navigation, existingPreset, handleGoBack, trackId]);

  return (
    <View style={styles.container}>
      <CategoryGrid presets={trackPresets} onSelect={handleSelect} />
    </View>
  );
};

TrackCategoryChooser.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
});
