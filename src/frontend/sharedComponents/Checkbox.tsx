import * as React from 'react';
import {
  type GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COMAPEO_BLUE, NEW_DARK_GREY, RED, WHITE} from '../lib/styles';

type CheckboxProps = {
  isChecked: boolean;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  error?: boolean;
};

export const Checkbox = ({isChecked, onPress, error}: CheckboxProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      style={[
        styles.checkBox,
        isChecked && styles.checkBoxChecked,
        error && {borderColor: RED},
      ]}>
      {isChecked && (
        <MaterialCommunityIcons name="check-bold" size={15} color={WHITE} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: NEW_DARK_GREY,
    borderRadius: 2,
  },
  checkBoxChecked: {
    backgroundColor: COMAPEO_BLUE,
    borderColor: COMAPEO_BLUE,
  },
});
