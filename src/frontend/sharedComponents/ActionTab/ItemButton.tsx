import React, {FC} from 'react';
import {ActionTabItems} from '.';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {CustomCircleIcon} from './CustomCircleIcon';

export const ItemButton: FC<ActionTabItems> = ({
  onPress,
  icon,
  label,
  withCircle = true,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    <View style={styles.itemIcon}>
      {withCircle ? <CustomCircleIcon icon={icon} /> : <>{icon}</>}
    </View>
    <Text numberOfLines={1} style={styles.itemLabel}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontFamily: 'Rubik',
    fontSize: 12,
  },
});
