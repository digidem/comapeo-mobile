import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeNavigationScreen} from '../../sharedTypes';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  navTitle: {
    id: 'screen.ScreenWithHeader',
    defaultMessage: 'Setting Screen',
  },
});

export const ScreenWithHeader: NativeNavigationScreen<'Settings'> = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Stack Screen</Text>
  </View>
);

ScreenWithHeader.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontWeight: '900',
    fontSize: 32,
    textAlign: 'center',
  },
});
