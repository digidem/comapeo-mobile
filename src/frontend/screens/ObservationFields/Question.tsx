import React from 'react';

import {SelectOne} from './SelectOne';
import {SelectMultiple} from './SelectMultiple';
import {TextArea} from './TextArea';
import {Number} from './Number';
import {DatePicker} from './Date';
import {Field} from '@comapeo/schema';
import {
  SelectMultipleField,
  SelectOneField,
} from '../../sharedTypes/PresetTypes';
import {
  useDraftObservationState,
  useDraftObservationActions,
} from '../../contexts/DraftObservationContext';

export type QuestionProps = {
  field: Field;
};

export const Question = ({field}: QuestionProps) => {
  const tags = useDraftObservationState(store => store.value?.tags);
  const {updateTag} = useDraftObservationActions();
  const value = tags ? tags[field.tagKey] : '';

  if (field.type === 'selectOne' && Array.isArray(field.options)) {
    return <SelectOne field={field as SelectOneField} />;
  }

  if (field.type === 'selectMultiple' && Array.isArray(field.options)) {
    return <SelectMultiple field={field as SelectMultipleField} />;
  }

  if (field.type === 'number') {
    return <Number field={field} />;
  }

  // To do: update to type='date' when schema has changed
  if (field.type === 'text') {
    return (
      <DatePicker
        tagValue={value}
        updateTag={val => {
          updateTag(field.tagKey, val);
        }}
      />
    );
  }

  return <TextArea field={field} />;
};
