import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {MenuContent} from '../sharedComponents/MenuContent';

export function MenuScreen() {
  const navigation = useNavigation();

  function closeMenu() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <MenuContent closeMenu={closeMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
