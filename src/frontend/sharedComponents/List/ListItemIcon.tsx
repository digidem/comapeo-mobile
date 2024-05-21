import React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ViewStyleProp} from '../../sharedTypes';

type ListItemIconProps = {style?: ViewStyleProp} & (
  | {
      iconName: string;
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
          color="rgba(0, 0, 0, 0.54)"
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
