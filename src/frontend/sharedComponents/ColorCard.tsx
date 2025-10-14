import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {BLACK, VERY_LIGHT_GREY} from '../lib/styles';
import {ViewStyleProp} from '../sharedTypes';

export type ColorCardProps = {
  onPress?: () => void;
  testID?: string;
  style?: ViewStyleProp;
  children: React.ReactNode;
  backgroundColor: string;
};

export const ColorCard = ({
  children,
  onPress,
  backgroundColor,
  testID,
  style,
}: ColorCardProps) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      testID={testID}
      style={[styles.card, {backgroundColor: backgroundColor}, style]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: VERY_LIGHT_GREY,
    borderRadius: 6,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
});
