import React from 'react';

import {SelectOne} from './SelectOne';
import {SelectMultiple} from './SelectMultiple';
import {TextArea} from './TextArea';
import {Number} from './Number';
import {Field} from '@comapeo/schema';
import {
  SelectMultipleField,
  SelectOneField,
} from '../../sharedTypes/PresetTypes';

export type QuestionProps = {
  field: Field;
};

export const Question = ({field}: QuestionProps) => {
  return <Number field={field} />;
  if (field.type === 'selectOne' && Array.isArray(field.options)) {
    return <SelectOne field={field as SelectOneField} />;
  }

  if (field.type === 'selectMultiple' && Array.isArray(field.options)) {
    return <SelectMultiple field={field as SelectMultipleField} />;
  }

  if (field.type === 'number') {
    return <Number field={field} />;
  }

  return <TextArea field={field} />;
};
