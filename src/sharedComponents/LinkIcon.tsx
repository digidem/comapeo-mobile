import * as React from 'react';
import {StyleSheet} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import type {TextStyleProp} from '../sharedTypes';

/** The designs always draw the link on an angle, running lower left to upper right. */
export const LINK_ICON_ROTATION = -45;

export function LinkIcon({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: TextStyleProp;
}) {
  return (
    <MaterialIcon
      name="link"
      size={size}
      color={color}
      style={[styles.diagonal, style]}
    />
  );
}

const styles = StyleSheet.create({
  diagonal: {
    transform: [{rotate: `${LINK_ICON_ROTATION}deg`}],
  },
});
