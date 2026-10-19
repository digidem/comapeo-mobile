import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | (() => void);
  testID?: string;
};

export const HeaderRightIconContainer = ({
  children,
  onPress,
  testID,
}: Props) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container} testID={testID}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.container} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 44,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
