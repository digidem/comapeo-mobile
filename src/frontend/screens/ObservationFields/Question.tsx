import React from 'react';

import {SelectOne} from './SelectOne';
import {SelectMultiple} from './SelectMultiple';
import {TextArea} from './TextArea';
import {Field} from '@comapeo/schema';
import {
  SelectMultipleField,
  SelectOneField,
} from '../../sharedTypes/PresetTypes';

export type QuestionProps = {
  field: Field;
};

export const Question = ({field}: QuestionProps) => {
  if (field.type === 'selectOne' && Array.isArray(field.options)) {
    return <SelectOne field={field as SelectOneField} />;
  }

  if (field.type === 'selectMultiple' && Array.isArray(field.options)) {
    return <SelectMultiple field={field as SelectMultipleField} />;
  }

  return <TextArea field={field} />;
};
