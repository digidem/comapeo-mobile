import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Loading} from './Loading';
import {BLACK, DARK_MANGO, DARK_ORANGE, MAPEO_BLUE} from '../lib/styles';

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
    style={[styles.container, {bottom: isLoading ? 75 : 25}, style]}>
    <TouchableOpacity disabled={disabled || isLoading} onPress={onPress}>
      {!isLoading ? (
        <Image
          source={require('../images/add-button.png')}
          style={styles.button}
        />
      ) : (
        <Loading size={15} />
      )}
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
