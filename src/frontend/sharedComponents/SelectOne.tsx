import * as React from 'react';
import {StyleSheet} from 'react-native';

import {List, ListItem, ListItemText, ListItemIcon} from './List';

type SelectOneProps<T> = {
  value: T;
  onChange: (value: T) => T | void;
  options: Array<{
    value: T;
    label: string;
    hint?: React.ReactNode;
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
  <List>
    {options.map((item, index) => {
      const isSelected = item.value === value;
      return (
        <ListItem
          key={
            typeof item.value === 'string' || typeof item.value === 'number'
              ? item.value
              : index
          }
          testID={
            isSelected ? `${item.value}Button-selected` : `${item.value}Button`
          }
          onPress={() => !isSelected && onChange(item.value)}
          style={
            radioButtonPosition === 'right' ? styles.rowReverse : undefined
          }>
          <ListItemIcon
            iconName={
              isSelected ? 'radio-button-checked' : 'radio-button-unchecked'
            }
            style={
              radioButtonPosition === 'right'
                ? styles.alignRight
                : styles.alignLeft
            }
            color={color}
          />
          <ListItemText
            primary={item.label}
            secondary={item.hint}></ListItemText>
        </ListItem>
      );
    })}
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
