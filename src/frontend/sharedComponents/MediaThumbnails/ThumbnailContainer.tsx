import React from 'react';
import {StyleSheet, View} from 'react-native';

import {LIGHT_GREY} from '../../lib/styles';
import {ViewStyleProp} from '../../sharedTypes';

export function ThumbnailContainer({
  children,
  loading,
  size,
  style,
}: React.PropsWithChildren<{
  loading?: boolean;
  size: number;
  style?: ViewStyleProp;
}>) {
  return (
    <View
      style={[
        styles.base,
        {width: size, height: size, opacity: loading ? 0.4 : undefined},
        style,
      ]}>
      {children}
    </View>
  );
}

export const styles = StyleSheet.create({
  base: {
    backgroundColor: LIGHT_GREY,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
