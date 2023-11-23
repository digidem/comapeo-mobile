import * as React from 'react';

import {List, ListItem, ListItemText, ListItemIcon} from './List';

type SelectOneProps<T> = {
  value: T;
  onChange: (value: T) => T | void;
  options: Array<{
    value: T;
    label: string;
    hint?: string;
  }>;
};

export const SelectOne = <T,>({
  value,
  options,
  onChange,
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
        onPress={() => value !== item.value && onChange(item.value)}>
        <ListItemIcon
          iconName={
            item.value === value
              ? 'radio-button-checked'
              : 'radio-button-unchecked'
          }
        />
        <ListItemText primary={item.label} secondary={item.hint}></ListItemText>
      </ListItem>
    ))}
  </List>
);
