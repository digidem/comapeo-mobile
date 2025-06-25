import React from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import {defineMessages, FormattedMessage} from 'react-intl';
import {useDraftObservation} from '../hooks/useDraftObservation';
import {PresetCircleIcon} from '../sharedComponents/icons/PresetIcon';
import {WHITE} from '../lib/styles';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {CustomHeaderLeftClose} from '../sharedComponents/CustomHeaderLeftClose';
import {CustomHeaderLeft} from '../sharedComponents/CustomHeaderLeft';
import {Preset} from '@comapeo/schema';
import {usePresetsQuery} from '../hooks/server/presets';
import {usePersistedDraftObservation} from '../hooks/persistedState/usePersistedDraftObservation';
import {useTrackActions, useTrackState} from '../contexts/TrackStoreContext';
import {HeaderLeft} from './SaveTrack/HeaderLeft';

const m = defineMessages({
  categoryTitle: {
    id: 'screens.CategoryChooser.categoryTitle',
    defaultMessage: 'Choose a category',
    description: 'Title for category chooser screen',
  },
});

// Used to skip static message extraction for messages without a static ID
const DynFormattedMessage = FormattedMessage;

const ROW_HEIGHT = 120;
const MIN_COL_WIDTH = 100;

export const PresetChooser: NativeNavigationComponent<'PresetChooser'> = ({
  route,
  navigation,
}) => {
  const {updatePreset, usePreset} = useDraftObservation();
  const {data: presets} = usePresetsQuery();
  const {setTrackPreset} = useTrackActions();
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const observationPreset = usePreset();
  const trackPreset = useTrackState(state => state.preset);
  const mode = route.params?.mode || 'observation';
  const existingPreset = mode === 'track' ? trackPreset : observationPreset;

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props =>
        mode === 'track' ? (
          existingPreset ? (
            <CustomHeaderLeft
              onPress={handleGoBack}
              headerBackButtonProps={props}
            />
          ) : (
            <HeaderLeft headerBackButtonProps={props} />
          )
        ) : existingPreset ? (
          <CustomHeaderLeft
            onPress={handleGoBack}
            headerBackButtonProps={props}
          />
        ) : (
          <CustomHeaderLeftClose headerBackButtonProps={props} />
        ),
    });
  }, [navigation, existingPreset, handleGoBack, mode]);

  const presetsList = Array.from(presets)
    // Only show presets where the geometry property includes "point"
    .filter(p => p.geometry.includes(mode === 'track' ? 'line' : 'point'))
    // Sort presets by sort property and then by name, then filter only point presets
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const handleSelectPreset = (selectedPreset: Preset) => {
    if (mode === 'track') {
      setTrackPreset(selectedPreset);
      navigation.navigate('SaveTrack');
    } else {
      updatePreset(selectedPreset);
      if (observationId) {
        navigation.navigate('ObservationEdit', {observationId});
      } else {
        navigation.navigate('ObservationCreate');
      }
    }
  };

  const rowsPerWindow = Math.ceil(
    (Dimensions.get('window').height - 65) / ROW_HEIGHT,
  );
  const numColumns = Math.floor(Dimensions.get('window').width / MIN_COL_WIDTH);

  return (
    <View style={styles.container} testID="MAIN.categories-scrn">
      <FlatList
        initialNumToRender={rowsPerWindow}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        windowSize={1}
        maxToRenderPerBatch={numColumns}
        removeClippedSubviews
        style={{width: Dimensions.get('window').width}}
        renderItem={({item}) => (
          <Item
            key={keyExtractor(item)}
            item={item}
            onSelect={handleSelectPreset}
          />
        )}
        data={presetsList}
        numColumns={numColumns}
      />
    </View>
  );
};

function getItemLayout(_data: unknown, index: number) {
  return {
    length: ROW_HEIGHT,
    offset: ROW_HEIGHT * index,
    index,
  };
}

function keyExtractor(item: {docId: string}) {
  return item.docId;
}

const Item = React.memo(
  ({item, onSelect}: {item: Preset; onSelect: (preset: Preset) => void}) => (
    <TouchableHighlight
      style={styles.cellTouchable}
      onPress={() => onSelect(item)}
      activeOpacity={1}
      underlayColor="#000033">
      <View style={styles.cellContainer}>
        <PresetCircleIcon iconId={item.iconRef?.docId} size="medium" />
        <Text numberOfLines={3} style={styles.categoryName}>
          <DynFormattedMessage
            id={`presets.${item.docId}.name`}
            defaultMessage={item.name}
          />
        </Text>
      </View>
    </TouchableHighlight>
  ),
);

PresetChooser.navTitle = m.categoryTitle;

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: WHITE,
  },
  cellTouchable: {
    flex: 1,
    height: ROW_HEIGHT,
    marginBottom: 5,
    borderRadius: 10,
  },
  cellContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'white',
  },
  categoryName: {
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
