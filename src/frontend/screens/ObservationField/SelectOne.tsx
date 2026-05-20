import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {Field, Observation} from '@comapeo/schema';

type SelectOneProps = {
  options: NonNullable<Field['options']>;
  updateTag: (value: Observation['tags'][number]) => void;
  tagValue?: Observation['tags'][number];
};

export const SelectOne = ({
  options,
  updateTag,
  tagValue: selectedValue,
}: SelectOneProps) => {
  return (
    <>
      {options.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          onPress={() => updateTag(item.value)}>
          <View
            style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}>
            <MaterialIcon
              name={
                item.value === selectedValue
                  ? 'radio-button-checked'
                  : 'radio-button-unchecked'
              }
              size={30}
            />
            <HeaderText style={styles.itemLabel} variant="header4">
              {item.label}
            </HeaderText>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

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
