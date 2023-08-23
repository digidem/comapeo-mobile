import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const DummyScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Test screen</Text>
    <MaterialIcons name={'home'} size={30} color={'white'} />
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
