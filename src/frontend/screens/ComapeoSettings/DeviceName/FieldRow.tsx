import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BLACK} from '../../../lib/styles';

export const FieldRow = ({
  label,
  children,
}: React.PropsWithChildren<{label: string}>) => {
  return (
    <View style={styles.container}>
      <HeaderText weight={700} variant="header5" style={styles.label}>
        {label}
      </HeaderText>
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
    color: BLACK,
  },
});
