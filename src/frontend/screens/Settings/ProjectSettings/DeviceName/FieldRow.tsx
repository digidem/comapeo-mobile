import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';

export const FieldRow = ({
  label,
  children,
}: React.PropsWithChildren<{label: string}>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    rowGap: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});
