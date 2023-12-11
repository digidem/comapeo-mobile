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
import {CategoryCircleIcon} from '../sharedComponents/icons/CategoryIcon';
import {WHITE} from '../lib/styles';
import {NativeNavigationComponent} from '../sharedTypes';
import {CustomHeaderLeftClose} from '../sharedComponents/CustomHeaderLeftClose';
import {CustomHeaderLeft} from '../sharedComponents/CustomHeaderLeft';
import {Preset} from '@mapeo/schema';
import {usePresetsQuery} from '../hooks/server/presets';

const m = defineMessages({
  categoryTitle: {
    id: 'screens.CategoryChooser.categoryTitle',
    defaultMessage: 'Choose what is happening',
    description: 'Title for category chooser screen',
  },
});

// Used to skip static message extraction for messages without a static ID
const DynFormattedMessage = FormattedMessage;

const ROW_HEIGHT = 120;
const MIN_COL_WIDTH = 100;

export const PresetChooser: NativeNavigationComponent<'PresetChooser'> = ({
  navigation,
}) => {
  const {updatePreset} = useDraftObservation();
  const {data: presets} = usePresetsQuery();
  const state = navigation.getState();
  const currentIndex = state.index;
  const routes = state.routes;
  const prevRouteNameInStack = !routes[currentIndex - 1]
    ? undefined
    : routes[currentIndex - 1].name;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props =>
        prevRouteNameInStack === 'Home' ? (
          <CustomHeaderLeftClose headerBackButtonProps={props} />
        ) : (
          <CustomHeaderLeft headerBackButtonProps={props} />
        ),
    });
  }, [prevRouteNameInStack, CustomHeaderLeft, CustomHeaderLeftClose]);

  const presetsList = !presets
    ? null
    : Array.from(presets)
        // Only show presets where the geometry property includes "point"
        .filter(p => p.geometry.includes('point'))
        // Sort presets by sort property and then by name, then filter only point presets
        .sort((a, b) => {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

  const handleSelectPreset = (selectedPreset: Preset) => {
    updatePreset(selectedPreset);
    navigation.navigate('ObservationEdit');
  };

  const rowsPerWindow = Math.ceil(
    (Dimensions.get('window').height - 65) / ROW_HEIGHT,
  );
  const numColumns = Math.floor(Dimensions.get('window').width / MIN_COL_WIDTH);

  return (
    <View style={styles.container}>
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
      underlayColor="#000033"
      testID={`${item.docId}CategoryButton`}>
      <View style={styles.cellContainer}>
        <CategoryCircleIcon size="medium" />
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
