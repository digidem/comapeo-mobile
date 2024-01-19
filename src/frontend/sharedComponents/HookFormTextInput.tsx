import * as React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  useWatch,
  ValidationRule,
  useFormState,
  UseControllerProps,
} from 'react-hook-form';
import {TextInput as RNTextInput, StyleSheet, View} from 'react-native';
import {BLACK, LIGHT_GREY, RED} from '../lib/styles';
import {ErrorIcon} from './icons';
import {ViewStyleProp} from '../sharedTypes';
import {Text} from './Text';

type Transform<T extends string> = {
  transform: (value: string | undefined) => T;
};

type TextInputProps<T extends string, InputFields extends FieldValues> = {
  containerStyle?: ViewStyleProp;
  showCharacterCount?: boolean;
  control: Control<InputFields>;
  toUppercase?: boolean;
  toLowercase?: boolean;
  transform?: Transform<T>;
} & Omit<
  React.ComponentProps<typeof RNTextInput>,
  'value' | 'onBlur' | 'onChange'
> &
  Omit<UseControllerProps<InputFields>, 'control'>;

type CounterProps<InputFields extends FieldValues> = {
  name: Path<InputFields>;
  control: Control<InputFields>;
  maxLength: ValidationRule<number>;
  isMaxLengthError: boolean;
};

/**
 *
 * Uses React Hook Form. The name and control should come from the `useForm<T>`. More info here https://www.react-hook-form.com/get-started/#ReactNative. This component also has access to all the same props as React Native's `<TextInput/>`
 */
export const HookFormTextInput = <
  T extends string,
  InputFields extends FieldValues,
>({
  name,
  control,
  rules,
  containerStyle,
  showCharacterCount,
  transform,
  ...RNInputProp
}: TextInputProps<T, InputFields>) => {
  const error = useFormState({control}).errors[name];

  const maxLengthRule = rules ? rules['maxLength'] : undefined;
  const maxLength =
    typeof maxLengthRule === 'number' ? maxLengthRule : maxLengthRule?.value;
  const errorMessage = error?.message;

  return (
    <React.Fragment>
      <View style={[styles.input, containerStyle, error ? styles.error : {}]}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field: {value, onChange, onBlur}}) => (
            <RNTextInput
              style={[{flex: 1, color: BLACK}]}
              value={transform ? transform.transform(value) : value}
              onBlur={onBlur}
              onChangeText={e =>
                onChange(transform ? transform.transform(e) : e)
              }
              {...RNInputProp}
            />
          )}
        />
        {error && <ErrorIcon style={{position: undefined}} color={RED} />}
      </View>
      <View
        style={[
          styles.underContainer,
          {justifyContent: !errorMessage ? 'flex-end' : 'space-between'},
        ]}>
        {errorMessage && (
          <Text style={{color: RED}}>{errorMessage.toString()}</Text>
        )}
        {maxLength && showCharacterCount && (
          <Counter
            isMaxLengthError={error?.type === 'maxLength'}
            control={control}
            name={name}
            maxLength={maxLength}
          />
        )}
      </View>
    </React.Fragment>
  );
};

const Counter = <InputFields extends FieldValues>({
  maxLength,
  control,
  name,
  isMaxLengthError,
}: CounterProps<InputFields>) => {
  const watcher = useWatch({control, name});
  const inputCount = watcher?.length || 0;

  return (
    <Text
      style={[
        {color: isMaxLengthError ? RED : LIGHT_GREY},
      ]}>{`${inputCount}/${maxLength}`}</Text>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: LIGHT_GREY,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  error: {
    borderColor: RED,
  },
  underContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
