import * as React from 'react';
import {View, StyleSheet, Easing} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
import {WHITE} from '../lib/styles';

export const Loading = ({color}: {color?: string}) => (
  <View style={styles.root}>
    <DotIndicator
      color={color}
      count={3}
      animationDuration={1500}
      size={10}
      animationEasing={Easing.ease}
    />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
