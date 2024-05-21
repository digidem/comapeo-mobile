import React, {FC} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {NEW_DARK_GREY} from '../../lib/styles';
import Plus from '../../images/redesign/Plus.svg';
import {defineMessages, FormattedMessage} from 'react-intl';
import {ActionTabItems} from '.';

const m = defineMessages({
  showOptions: {
    id: 'shareComponent.KeyboardAccessory.showOptions',
    defaultMessage: 'Show Options',
    description: 'title for observation options',
  },
});

interface KeyboardAccessory {
  items: ActionTabItems[];
  onPress: () => unknown;
}

export const KeyboardAccessory: FC<KeyboardAccessory> = ({onPress, items}) => {
  return (
    <View style={[styles.containerPadding, styles.flexRow]}>
      <View style={[styles.flexRow, styles.accessoryMainWrapper]}>
        <Plus style={{marginRight: 10}} />
        <Text style={styles.text} numberOfLines={1}>
          <FormattedMessage {...m.showOptions} />
        </Text>
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
};

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
