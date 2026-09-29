import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {NEW_DARK_GREY, VERY_LIGHT_GREY, WHITE} from '../lib/styles';

type MaterialIconName = React.ComponentProps<typeof MaterialIcon>['name'];

export type CircleIcon = {
  name: MaterialIconName;
  color?: string;
  /** Degrees, for the glyphs the designs show on an angle. */
  rotate?: number;
};

export type CircleBadge = {
  color: string;
  name?: MaterialIconName;
};

/**
 * Grey circle with an icon in it and a badge overlapping the bottom
 * right, used in many of the invite link screens to show what is happening.
 */
export function StatusCircleIcon({
  icon,
  badge,
  size = 80,
}: {
  icon: CircleIcon;
  badge: CircleBadge;
  size?: number;
}) {
  const badgeSize = Math.round(size * 0.375);

  return (
    <View
      style={[
        styles.circle,
        {width: size, height: size, borderRadius: size / 2},
      ]}>
      <MaterialIcon
        name={icon.name}
        size={Math.round(size * 0.625)}
        color={icon.color || NEW_DARK_GREY}
        style={
          icon.rotate ? {transform: [{rotate: `${icon.rotate}deg`}]} : undefined
        }
      />
      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: badge.color,
          },
        ]}>
        {badge.name ? (
          <MaterialIcon
            name={badge.name}
            size={badgeSize * 0.75}
            color={WHITE}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: VERY_LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
