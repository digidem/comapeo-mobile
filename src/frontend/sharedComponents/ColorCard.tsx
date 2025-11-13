import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {BLACK, VERY_LIGHT_GREY} from '../lib/styles';

export type ColorCardProps = {
  onPress?: () => void;
  testID?: string;
  borderColor?: string;
  children: React.ReactNode;
  backgroundColor: string;
};

export const ColorCard = ({
  children,
  onPress,
  backgroundColor,
  borderColor,
  testID,
}: ColorCardProps) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor || VERY_LIGHT_GREY,
        },
      ]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 6,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
});
