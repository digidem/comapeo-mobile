import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {SelectMultipleField} from '../../sharedTypes/PresetTypes';
import {Field, Observation} from '@comapeo/schema';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

type SelectMultipleProps = {
  options: NonNullable<Field['options']>;
  updateTag: (value: Observation['tags'][number]) => void;
  tagValue?: Observation['tags'][number];
};

export const SelectMultiple = ({
  options,
  updateTag,
  tagValue,
}: SelectMultipleProps) => {
  const valueAsArray = toArray(tagValue ?? undefined);

  const handleChange = (
    itemValue: SelectMultipleField['options'][0]['value'],
  ) => {
    const updatedValue = valueAsArray.includes(itemValue)
      ? valueAsArray.filter(d => d !== itemValue)
      : [...valueAsArray, itemValue];
    updateTag(updatedValue);
  };

  return (
    <View testID="OBS.select-multiple-inp">
      {options.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          accessibilityRole="checkbox"
          testID={`OBS.select-multiple-inp-${item.label}`}
          accessibilityState={{selected: valueAsArray.includes(item.value)}}
          onPress={() => handleChange(item.value)}>
          <View
            style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}>
            <MaterialIcon
              name={
                valueAsArray.includes(item.value)
                  ? 'check-box'
                  : 'check-box-outline-blank'
              }
              size={30}
            />
            <HeaderText variant="header4" style={styles.itemLabel}>
              {item.label}
            </HeaderText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

function toArray(value?: Observation['tags'][0]) {
  // null or undefined
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#F3F3F3',
  },
  noBorder: {
    borderTopWidth: 0,
  },
  itemLabel: {
    marginLeft: 20,
    flex: 1,
  },
});
