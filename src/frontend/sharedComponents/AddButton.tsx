import React from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface AddButtonProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
  onPress: ((event: GestureResponderEvent) => void) & (() => void);
}

const AddButtonNoMemo = ({
  style,
  testID,
  onPress,
  disabled,
}: AddButtonProps) => (
  <View testID={testID} style={[styles.container, style]}>
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Image
        source={require('../images/add-button.png')}
        style={styles.button}
      />
    </TouchableOpacity>
  </View>
);

/**
 * Button used on main map and camera mode to take observation
 */
export const AddButton = React.memo(AddButtonNoMemo);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
  },
  button: {
    width: 125,
    height: 125,
  },
});
