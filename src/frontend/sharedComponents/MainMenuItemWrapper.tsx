import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

type MainMenuItemWrapperProps = {
  onPress: TouchableOpacityProps['onPress'];
  children: React.ReactNode;
  accessibilityLabel: string;
};

export function MainMenuItemWrapper({
  onPress,
  children,
  accessibilityLabel,
}: MainMenuItemWrapperProps) {
  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
