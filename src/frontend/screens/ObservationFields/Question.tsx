import React from 'react';

import {SelectOne} from './SelectOne';
import {SelectMultiple} from './SelectMultiple';
import {TextArea} from './TextArea';
import {Field} from '@mapeo/schema';

export type QuestionProps = {
  field: Field;
};

export const Question = ({field}: QuestionProps) => {
  if (field.type === 'selectOne' && Array.isArray(field.options)) {
    // @ts-ignore
    return <SelectOne field={field} />;
  }

  if (field.type === 'selectMultiple' && Array.isArray(field.options)) {
    // @ts-ignore
    return <SelectMultiple field={field} />;
  }

  return <TextArea field={field} />;
};
