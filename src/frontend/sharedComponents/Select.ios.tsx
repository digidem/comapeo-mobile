import * as React from 'react';
import {ActionSheetIOS, Pressable, StyleSheet} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {defineMessages, useIntl} from 'react-intl';

import {BLACK, LIGHT_GREY} from '../lib/styles';
import {ViewStyleProp} from '../sharedTypes';
import {BodyText} from './Text/BodyText';

const m = defineMessages({
  cancel: {
    id: 'sharedComponents.Select.cancel',
    defaultMessage: 'Cancel',
  },
});

type Option<Value> = {
  value: Value;
  label: string;
};

type Props<Value> = {
  containerStyles?: ViewStyleProp;
  label?: string;
  mode?: 'dialog' | 'dropdown';
  onChange: (value: Value, index: number) => void;
  options: Option<Value>[];
  selectedValue: Value;
  testID?: string;
};

// iOS has no dropdown Picker (it always renders the inline wheel), so open an
// action sheet from a box that matches the Android dropdown.
export const Select = <Value extends string | number>({
  containerStyles,
  label,
  onChange,
  options,
  selectedValue,
  testID,
}: Props<Value>) => {
  const {formatMessage: t} = useIntl();

  const selectedOption = options.find(option => option.value === selectedValue);

  const openOptions = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...options.map(option => option.label), t(m.cancel)],
        cancelButtonIndex: options.length,
      },
      index => {
        const option = options[index];
        if (option) {
          onChange(option.value, index);
        }
      },
    );
  };

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityValue={{text: selectedOption?.label}}
      onPress={openOptions}
      style={[styles.container, containerStyles]}
      testID={testID}>
      <BodyText numberOfLines={1} style={styles.label} variant="large">
        {selectedOption?.label}
      </BodyText>
      <MaterialIcons name="arrow-drop-down" size={24} color={BLACK} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 4,
  },
  label: {
    flex: 1,
    color: BLACK,
  },
});
