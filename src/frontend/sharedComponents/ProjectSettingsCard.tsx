import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {WHITE, VERY_LIGHT_GREY, BLACK} from '../lib/styles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  borderColor?: string;
}

export const ProjectSettingsCard = ({
  children,
  style,
  backgroundColor = WHITE,
  borderColor = VERY_LIGHT_GREY,
}: CardProps) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 20,
    gap: 12,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
  },
});
