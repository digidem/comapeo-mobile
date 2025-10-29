import React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {useTrackActions} from '../../contexts/TrackStoreContext';
import {CategoryGrid} from './CategoryGrid';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {WHITE} from '../../lib/styles';
import {HeaderLeft} from '../SaveTrack/HeaderLeft';
import {Preset} from '@comapeo/schema';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {useTrackPresets} from '../../hooks/server/track';

const m = defineMessages({
  title: {
    id: 'screens.TrackCategoryChooser.title',
    defaultMessage: 'Choose a category',
  },
});

export const TrackCategoryChooser: NativeNavigationComponent<
  'TrackCategoryChooser'
> = ({navigation, route}) => {
  const trackPresets = useTrackPresets();
  const {setTrackPreset} = useTrackActions();

  const handleSelect = (preset: Preset) => {
    if (route.params.trackAction === 'saveNew') {
      setTrackPreset(preset);
      navigation.navigate('SaveTrack');
      return;
    }

    navigation.popTo('TrackEdit', {
      newPresetId: preset.docId,
      trackId: route.params.trackId,
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props =>
        route.params.trackAction === 'editExisting' ? (
          <CustomHeaderLeft
            onPress={navigation.goBack}
            headerBackButtonProps={props}
          />
        ) : (
          <HeaderLeft headerBackButtonProps={props} />
        ),
    });
  }, [navigation, route.params.trackAction]);

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
