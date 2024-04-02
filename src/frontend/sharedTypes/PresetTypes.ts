import { Field } from '@mapeo/schema'

export interface TextField extends Field {
  appearance: 'singleline' | 'multiline'
  type: 'text'
}

interface BaseSelectField extends Field {
  options: {
    label: string
    value: string | boolean | number | null
  }[]
  type: 'selectOne' | 'selectMultiple'
}

export interface SelectOneField extends BaseSelectField {
  type: 'selectOne'
}

export interface SelectMultipleField extends BaseSelectField {
  type: 'selectMultiple'
}
