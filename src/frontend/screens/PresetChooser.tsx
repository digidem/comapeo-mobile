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
import {Preset} from '@mapeo/schema';
import {usePresetsQuery} from '../hooks/server/presets';
import {usePersistedDraftObservation} from '../hooks/persistedState/usePersistedDraftObservation';
import {CommonActions} from '@react-navigation/native';

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
  const {updatePreset, usePreset} = useDraftObservation();
  const {data: presets} = usePresetsQuery();
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const existingPreset = usePreset();

  const handleGoBack = React.useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    // If the user closes the app while editing of creating an observations, we
    if (observationId) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: 'Home'},
            {name: 'ObservationEdit', params: {observationId}},
          ],
        }),
      );
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}, {name: 'ObservationCreate'}],
      }),
    );
  }, [navigation, observationId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: props =>
        // If a preset exists, the user is editting the preset, so they should just navigate BACK to the create or edit observation screen
        existingPreset ? (
          <CustomHeaderLeft
            onPress={handleGoBack}
            headerBackButtonProps={props}
          />
        ) : (
          <CustomHeaderLeftClose headerBackButtonProps={props} />
        ),
    });
  }, [navigation, existingPreset, handleGoBack]);

  const presetsList = Array.from(presets)
    // Only show presets where the geometry property includes "point"
    .filter(p => p.geometry.includes('point'))
    // Sort presets by sort property and then by name, then filter only point presets
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const handleSelectPreset = (selectedPreset: Preset) => {
    updatePreset(selectedPreset);
    if (observationId) {
      navigation.navigate('ObservationEdit', {observationId});
      return;
    }
    navigation.navigate('ObservationCreate');
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
        <PresetCircleIcon presetDocId={item.iconRef?.docId} size="medium" />
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
