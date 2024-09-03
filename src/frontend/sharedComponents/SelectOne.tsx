import * as React from 'react';
import {StyleSheet} from 'react-native';

import {List, ListItem, ListItemText, ListItemIcon} from './List';

type SelectOneProps<T> = {
  value: T;
  onChange: (value: T) => T | void;
  options: Array<{
    value: T;
    label: string;
    hint?: string;
  }>;
  radioButtonPosition?: 'left' | 'right';
  color?: string;
};

export const SelectOne = <T,>({
  value,
  options,
  onChange,
  radioButtonPosition = 'left',
  color,
}: SelectOneProps<T>) => (
  <List dense>
    {options.map((item, index) => (
      <ListItem
        key={
          typeof item.value === 'string' || typeof item.value === 'number'
            ? item.value
            : index
        }
        testID={`${item.value}LanguageButton`}
        onPress={() => value !== item.value && onChange(item.value)}
        style={[radioButtonPosition === 'right' && styles.rowReverse]}>
        <ListItemIcon
          iconName={
            item.value === value
              ? 'radio-button-checked'
              : 'radio-button-unchecked'
          }
          style={[
            radioButtonPosition === 'right'
              ? styles.alignRight
              : styles.alignLeft,
          ]}
          color={color}
        />
        <ListItemText primary={item.label} secondary={item.hint}></ListItemText>
      </ListItem>
    ))}
  </List>
);

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
});
