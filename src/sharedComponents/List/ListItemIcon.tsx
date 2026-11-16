import React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {ViewStyleProp} from '../../sharedTypes';
import type {MaterialIconsIconName} from '@react-native-vector-icons/material-icons';

type ListItemIconProps = {style?: ViewStyleProp; color?: string} & (
  | {
      iconName: MaterialIconsIconName;
    }
  | {icon: React.ReactNode}
);

/**
 * A simple wrapper to apply `List` styles to an `Icon` or `SvgIcon`.
 */
export const ListItemIcon = (props: ListItemIconProps) => {
  return (
    <View style={[styles.root, props.style]}>
      {'icon' in props ? (
        props.icon
      ) : (
        <MaterialIcon
          name={props.iconName}
          size={24}
          color={props.color || 'rgba(0, 0, 0, 0.54)'}
        />
      )}
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
