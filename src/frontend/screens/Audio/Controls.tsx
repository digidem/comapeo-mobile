import React, {PropsWithChildren} from 'react';
import {
  Dimensions,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';

import PlayArrow from '../../images/PlayArrow.svg';
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

export function Play(props: BaseProps) {
  return (
    <ControlButtonPrimaryBase {...props}>
      <View style={styles.play}>
        <PlayArrow />
      </View>
    </ControlButtonPrimaryBase>
  );
}

export function Side({
  children,
  side,
}: PropsWithChildren<{side: 'right' | 'left'}>) {
  const {width} = Dimensions.get('window');

  const midpoint = width / 2;

  const sideControlOffset = Math.max(midpoint - 200, midpoint / 3);

  return (
    <View style={[styles.sideControl, {[side]: sideControlOffset}]}>
      {children}
    </View>
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
