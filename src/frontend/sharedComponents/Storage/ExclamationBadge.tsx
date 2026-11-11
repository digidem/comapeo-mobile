import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DARK_ORANGE, WHITE} from '../../lib/styles';
import {RUBIK} from '../../lib/fonts';

type Props = {
  testID: string;
};

export function ExclamationBadge({testID}: Props) {
  return (
    <View
      testID={testID}
      accessibilityLabel="Low storage alert"
      pointerEvents="none"
      style={styles.badge}>
      <Text style={styles.mark}>!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DARK_ORANGE,
  },
  mark: {
    color: WHITE,
    fontFamily: RUBIK[700],
    fontSize: 7,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
