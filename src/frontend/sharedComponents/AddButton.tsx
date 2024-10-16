import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import AddButtonSVG from '../images/AddButton.svg';
import {UIActivityIndicator} from 'react-native-indicators';

interface AddButtonProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
  onPress: ((event: GestureResponderEvent) => void) & (() => void);
  isLoading?: boolean;
}
const AddButtonNoMemo = ({
  style,
  testID,
  onPress,
  disabled,
  isLoading = false,
}: AddButtonProps) => (
  <View
    testID={testID}
    style={[styles.container, {bottom: isLoading ? 50 : 25}, style]}>
    <TouchableOpacity disabled={disabled || isLoading} onPress={onPress}>
      {isLoading ? <UIActivityIndicator size={50} /> : <AddButtonSVG />}
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
    alignSelf: 'center',
  },
  button: {
    width: 125,
    height: 125,
  },
});
