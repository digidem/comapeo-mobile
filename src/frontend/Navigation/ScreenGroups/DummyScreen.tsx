import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes';
import {
  BottomSheetContent,
  BottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';

export const DummyScreen = (
  prop: NativeHomeTabsNavigationProps<'Map' | 'Camera'>,
) => (
  <View style={styles.container}>
    <Text style={styles.text}>Test screen</Text>
    <Button
      onPress={() => {
        prop.navigation.navigate('Settings');
      }}
      title="Nav to stack"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'deeppink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '900',
    fontSize: 32,
    textAlign: 'center',
  },
});
