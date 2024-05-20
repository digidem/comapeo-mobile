import React, {FC} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {NEW_DARK_GREY} from '../../lib/styles';
import Plus from '../../images/redesign/Plus.svg';
import {ActionTabItems} from './ActionTab';

interface KeyboardAccessory {
  items: ActionTabItems[];
  onPress: () => unknown;
}
export const KeyboardAccessory: FC<KeyboardAccessory> = ({onPress, items}) => (
  <View style={[styles.flexRow, styles.containerPadding]}>
    <View style={[styles.flexRow, styles.accessoryMainWrapper]}>
      <Plus style={{marginRight: 10}} />
      <Text style={styles.text}>Show Options</Text>
    </View>
    <View style={styles.flexRow}>
      {items.map((item, idx) => (
        <Pressable onPress={onPress} key={idx} style={styles.accessoryIcon}>
          {item.icon}
        </Pressable>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Rubik',
    color: NEW_DARK_GREY,
  },
  containerPadding: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  accessoryMainWrapper: {
    flex: 1,
  },
  accessoryIcon: {
    paddingHorizontal: 10,
  },
});
