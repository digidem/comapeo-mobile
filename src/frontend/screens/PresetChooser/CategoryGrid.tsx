import React from 'react';
import {
  FlatList,
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {Preset} from '@comapeo/schema';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {FormattedMessage} from 'react-intl';

const ROW_HEIGHT = 120;
const MIN_COL_WIDTH = 100;

function keyExtractor(item: {docId: string}) {
  return item.docId;
}

function getItemLayout(_data: unknown, index: number) {
  return {
    length: ROW_HEIGHT,
    offset: ROW_HEIGHT * index,
    index,
  };
}

// Used to skip static message extraction for messages without a static ID
const DynFormattedMessage = FormattedMessage;

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

export const CategoryGrid = ({
  presets,
  onSelect,
}: {
  presets: Preset[];
  onSelect: (preset: Preset) => void;
}) => {
  const rowsPerWindow = Math.ceil(
    (Dimensions.get('window').height - 65) / ROW_HEIGHT,
  );
  const numColumns = Math.floor(Dimensions.get('window').width / MIN_COL_WIDTH);

  return (
    <FlatList
      initialNumToRender={rowsPerWindow}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      windowSize={1}
      maxToRenderPerBatch={numColumns}
      removeClippedSubviews
      style={{width: Dimensions.get('window').width}}
      renderItem={({item}) => (
        <Item key={item.docId} item={item} onSelect={onSelect} />
      )}
      data={presets}
      numColumns={numColumns}
    />
  );
};

const styles = StyleSheet.create({
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
