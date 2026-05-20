import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {TouchableNativeFeedback} from '../../sharedComponents/Touchables';
import {VERY_LIGHT_BLUE} from '../../lib/styles';
import {QuestionLabel} from './QuestionLabel';

import type {QuestionProps} from './Question';
import {ViewStyleProp} from '../../sharedTypes';
import {SelectOneField} from '../../sharedTypes/PresetTypes';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';

interface Props extends QuestionProps {
  field: SelectOneField;
}

type RadioItemProps = {
  checked: boolean;
  onPress: () => void;
  label: string;
  style: ViewStyleProp;
};

const RadioItem = ({checked, onPress, label, style}: RadioItemProps) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
    <View style={style}>
      <MaterialIcon
        name={checked ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={30}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

export const SelectOne = React.memo<Props>(({field}) => {
  const {updateTag} = useDraftObservationActions();
  const tags = useDraftObservationState(state => state.value?.tags);

  return (
    <>
      <QuestionLabel field={field} />
      {field.options.map((item, index) => (
        <RadioItem
          key={item.label}
          onPress={() => updateTag(field.tagKey, item.value)}
          checked={tags && item.value === tags[field.tagKey] ? true : false}
          label={item.label}
          style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}
        />
      ))}
    </>
  );
});

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
