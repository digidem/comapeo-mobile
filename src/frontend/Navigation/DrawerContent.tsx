import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const DrawerContent = () => {
  return (
    <View style={styles.container}>
      <Text>Drawer Content Placeholder</Text>
      <Text>TODO: Implement drawer content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
