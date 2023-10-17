import {Field} from '@mapeo/schema';

export interface TextField extends Field {
  appearance: Field['appearance'];
  type: 'text';
}

interface BaseSelectField extends Field {
  options: {
    label: string;
    value: string | boolean | number | null;
  }[];
  type: 'selectOne' | 'selectMultiple';
}

export interface SelectOneField extends BaseSelectField {
  type: 'selectOne';
}

export interface SelectMultipleField extends BaseSelectField {
  type: 'selectMultiple';
}

// Calling this FieldValueType to seperate it from @mapeo/schema's FieldValue
export type FieldValueType = SelectableFieldValue | SelectableFieldValue[];

export type SelectableFieldValue = boolean | number | string | null;

export interface LabeledSelectOption {
  label: string;
  value: SelectableFieldValue;
}

export type SelectOptions = (SelectableFieldValue | LabeledSelectOption)[];
