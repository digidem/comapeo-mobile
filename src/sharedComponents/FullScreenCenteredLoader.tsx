import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {LoadingIndicator} from './LoadingIndicator';

export const FullScreenCenteredLoader = () => (
  <View style={styles.root}>
    <LoadingIndicator />
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
