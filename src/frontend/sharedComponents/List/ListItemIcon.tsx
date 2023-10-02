import React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

/**
 * A simple wrapper to apply `List` styles to an `Icon` or `SvgIcon`.
 */
export const ListItemIcon = ({iconName}: {iconName: string}) => {
  return (
    <View style={styles.root}>
      <MaterialIcon name={iconName} size={24} color="rgba(0, 0, 0, 0.54)" />
    </View>
  );
};

export const styles = StyleSheet.create({
  /* Styles applied to the root element. */
  root: {
    minWidth: 56,
    flexShrink: 0,
    justifyContent: 'center',
  },
});
