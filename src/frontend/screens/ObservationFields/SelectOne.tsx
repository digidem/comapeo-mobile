import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useIntl} from 'react-intl';

import {TouchableNativeFeedback} from '../../sharedComponents/Touchables';
import {VERY_LIGHT_BLUE} from '../../lib/styles';
import {QuestionLabel} from './QuestionLabel';
import {convertSelectOptionsToLabeled} from '../../lib/utils';

import type {QuestionProps} from './Question';
import {ViewStyleProp} from '../../sharedTypes';
import {Field} from '@mapeo/schema';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {SelectOneField} from '../../sharedTypes/PresetTypes';

interface Props extends QuestionProps {
  field: SelectOneField;
}

type RadioItemProps = {
  checked: boolean;
  onPress: () => any;
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
  const {formatMessage: t} = useIntl();

  const {updateObservationFields} = useDraftObservation();
  const tags = usePersistedDraftObservation(store => store.value?.tags);

  return (
    <>
      <QuestionLabel field={field} />
      {convertSelectOptionsToLabeled(field.options).map((item, index) => (
        <RadioItem
          key={item.label}
          onPress={() =>
            updateObservationFields({tagKey: field.tagKey, value: item.value})
          }
          checked={tags && item.value === tags[field.tagKey] ? true : false}
          label={t({
            id: `fields.${field.docId}.options.${JSON.stringify(item.value)}`,
            defaultMessage: item.label,
          })}
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
