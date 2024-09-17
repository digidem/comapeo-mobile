import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Text} from '../../sharedComponents/Text';
import {TouchableNativeFeedback} from '../../sharedComponents/Touchables';
import {VERY_LIGHT_BLUE} from '../../lib/styles';
import {QuestionLabel} from './QuestionLabel';

import type {QuestionProps} from './Question';
import {SelectMultipleField} from '../../sharedTypes/PresetTypes';
import {ViewStyleProp} from '../../sharedTypes';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {Observation} from '@comapeo/schema';

interface Props extends QuestionProps {
  field: SelectMultipleField;
}

type CheckItemProps = {
  checked: boolean;
  onPress: () => any;
  label: string;
  style: ViewStyleProp;
};

const CheckItem = ({checked, onPress, label, style}: CheckItemProps) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
    <View style={style}>
      <MaterialIcon
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={30}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

export const SelectMultiple = React.memo<Props>(({field}) => {
  const tags = usePersistedDraftObservation(val => val.value?.tags);
  const valueAsArray = toArray(tags ? tags[field.tagKey] : undefined);
  const {updateTags} = useDraftObservation();

  const handleChange = (
    itemValue: SelectMultipleField['options'][0]['value'],
  ) => {
    const updatedValue = valueAsArray.includes(itemValue)
      ? valueAsArray.filter(d => d !== itemValue)
      : [...valueAsArray, itemValue];
    updateTags(field.tagKey, updatedValue);
  };

  return (
    <>
      <QuestionLabel field={field} />
      {field.options.map((item, index) => (
        <CheckItem
          key={item.label}
          onPress={() => handleChange(item.value)}
          checked={valueAsArray.includes(item.value)}
          label={item.label}
          style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}
        />
      ))}
    </>
  );
});

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
    fontSize: 18,
    lineHeight: 24,
    marginLeft: 20,
    flex: 1,
    color: 'black',
    fontWeight: '700',
  },
});
