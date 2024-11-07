import * as React from 'react';
import CheckBoxSelected from '../images/checkbox/CheckboxSelected.svg';
import CheckBoxUnSelected from '../images/checkbox/CheckboxUnselected.svg';
import CheckBoxError from '../images/checkbox/CheckboxError.svg';
import {TouchableOpacity} from 'react-native';

type CheckboxProps = {
  value: boolean;
  onPress: () => void;
  testID?: string;
  disabled?: boolean;
  error?: boolean;
  hitSlop: React.ComponentProps<typeof TouchableOpacity>['hitSlop'];
};

export const Checkbox = ({
  value,
  onPress,
  testID,
  disabled,
  error,
  hitSlop,
}: CheckboxProps) => {
  if (error) {
    return <CheckBoxError />;
  }

  return (
    <TouchableOpacity
      hitSlop={hitSlop}
      testID={testID}
      disabled={disabled}
      onPress={onPress}>
      {value ? <CheckBoxSelected /> : <CheckBoxUnSelected />}
    </TouchableOpacity>
  );
};
