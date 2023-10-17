import React from 'react';

import {SelectOne} from './SelectOne';
import {SelectMultiple} from './SelectMultiple';
import {TextArea} from './TextArea';
import {Field} from '@mapeo/schema';
import {isSelectMultipleField, isSelectOneField} from '../../lib/utils';

export type QuestionProps = {
  field: Field;
};

export const Question = ({field}: QuestionProps) => {
  if (isSelectOneField(field) && Array.isArray(field.options)) {
    return <SelectOne field={field} />;
  }

  if (isSelectMultipleField(field) && Array.isArray(field.options)) {
    return <SelectMultiple field={field} />;
  }

  return <TextArea field={field} />;
};
