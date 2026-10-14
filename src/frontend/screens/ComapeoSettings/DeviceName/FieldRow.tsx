import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BLACK} from '../../../lib/styles';
import {RUBIK} from '../../../lib/fonts';

export const FieldRow = ({
  label,
  children,
}: React.PropsWithChildren<{label: string}>) => {
  return (
    <View style={styles.container}>
      <HeaderText variant="header5" style={styles.label}>
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
    fontFamily: RUBIK[700],
    color: BLACK,
  },
});
