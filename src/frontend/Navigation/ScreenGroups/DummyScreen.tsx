import * as React from 'react';
import {StyleSheet, View} from 'react-native';

export const DummyScreen = () => <View style={styles.container} />;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'red'},
});
