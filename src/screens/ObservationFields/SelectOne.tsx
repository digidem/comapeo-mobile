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

export const SelectOne = ({options, updateTag, tagValue}: SelectOneProps) => {
  return (
    <View testID="OBS.select-one-inp">
      {options.map((item, index) => {
        const isSelected = item.value === tagValue;
        return (
          <TouchableOpacity
            // eslint-disable-next-line @eslint-react/no-array-index-key
            key={`${index}-${String(item.value)}`}
            accessibilityRole="radio"
            testID={`OBS.select-one-inp-${item.label}`}
            accessibilityState={{checked: isSelected, selected: isSelected}}
            onPress={() => updateTag(item.value)}>
            <View
              style={[
                styles.radioContainer,
                index === 0 ? styles.noBorder : {},
              ]}>
              <MaterialIcon
                name={
                  isSelected ? 'radio-button-checked' : 'radio-button-unchecked'
                }
                size={30}
              />
              <HeaderText style={styles.itemLabel} variant="header4">
                {item.label}
              </HeaderText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
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
