import * as React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
  Path,
} from 'react-hook-form';
import {TextInput as RNTextInput} from 'react-native';

type TextInputProps<InputFields extends FieldValues> = {
  name: Path<InputFields>;
  control: Control<InputFields>;
  rules?: RegisterOptions;
} & Omit<
  React.ComponentProps<typeof RNTextInput>,
  'value' | 'onChangeText' | 'onBlur'
>;

/**
 *
 * Uses React Hook Form. The name and control should come from the `useForm<T>`. More info here https://www.react-hook-form.com/get-started/#ReactNative. This component also has access to all the same props as React Native's `<TextInput/>`
 */
export const HookFormTextInput = <InputFields extends FieldValues>({
  name,
  control,
  rules,
  ...RNtextInputProps
}: TextInputProps<InputFields>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({field: {value, onChange, onBlur}}) => (
        <RNTextInput
          value={value}
          onBlur={onBlur}
          onChangeText={onChange}
          {...RNtextInputProps}
        />
      )}
    />
  );
};
