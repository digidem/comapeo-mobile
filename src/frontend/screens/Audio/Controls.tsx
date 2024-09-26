import React, {PropsWithChildren} from 'react';
import {Pressable, PressableProps, StyleSheet, View} from 'react-native';

import {MAGENTA, BLACK, LIGHT_GREY, WHITE} from '../../lib/styles';

type BaseProps = PropsWithChildren<PressableProps>;

function ControlButtonPrimaryBase({children, ...pressableProps}: BaseProps) {
  return (
    <Pressable
      {...pressableProps}
      style={({pressed}) => [
        styles.basePressable,
        typeof pressableProps.style === 'function'
          ? pressableProps.style({pressed})
          : pressableProps.style,
        pressed && styles.pressablePressed,
      ]}>
      {children}
    </Pressable>
  );
}

export function Record(props: BaseProps) {
  return (
    <ControlButtonPrimaryBase {...props}>
      <View style={styles.record} />
    </ControlButtonPrimaryBase>
  );
}

export function Stop(props: BaseProps) {
  return (
    <ControlButtonPrimaryBase {...props}>
      <View style={styles.stop} />
    </ControlButtonPrimaryBase>
  );
}

export function Row({children}: PropsWithChildren) {
  return <View style={styles.controlsRow}>{children}</View>;
}

const PRIMARY_CONTROL_DIAMETER = 96;

const styles = StyleSheet.create({
  basePressable: {
    height: PRIMARY_CONTROL_DIAMETER,
    width: PRIMARY_CONTROL_DIAMETER,
    borderRadius: PRIMARY_CONTROL_DIAMETER,
    borderWidth: 12,
    borderColor: WHITE,
    overflow: 'hidden',
    backgroundColor: WHITE,
    justifyContent: 'center',
  },
  pressablePressed: {
    backgroundColor: LIGHT_GREY,
    borderColor: LIGHT_GREY,
  },

  record: {
    height: PRIMARY_CONTROL_DIAMETER,
    backgroundColor: MAGENTA,
  },
  stop: {
    height: PRIMARY_CONTROL_DIAMETER / 3,
    width: PRIMARY_CONTROL_DIAMETER / 3,
    backgroundColor: BLACK,
    alignSelf: 'center',
  },
  play: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideControl: {
    position: 'absolute',
  },
});
