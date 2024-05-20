import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ItemButton} from './ItemButton';
import {ActionProps} from './ActionTab';

export function Actions({items}: ActionProps) {
  return (
    <View style={[styles.container, styles.containerPadding]}>
      {items.map(item => (
        <ItemButton key={item.label} {...item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  containerPadding: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
});
