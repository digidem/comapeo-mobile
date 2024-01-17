import * as React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
  Path,
  useWatch,
  ValidationRule,
  useFormState,
} from 'react-hook-form';
import {TextInput as RNTextInput, StyleSheet, View} from 'react-native';
import {BLACK, LIGHT_GREY, RED} from '../lib/styles';
import {ErrorIcon} from './icons';
import {ViewStyleProp} from '../sharedTypes';
import {Text} from './Text';
import {MessageDescriptor, useIntl} from 'react-intl';

type RulesWithMessage = {
  [key in keyof RegisterOptions]?: {
    value: RegisterOptions[key];
    message?: MessageDescriptor;
  };
};

type TextInputProps<InputFields extends FieldValues> = {
  name: Path<InputFields>;
  control: Control<InputFields>;
  rulesWithMessage?: RulesWithMessage;
  style?: ViewStyleProp;
  showCount?: boolean;
} & Omit<
  React.ComponentProps<typeof RNTextInput>,
  'value' | 'onChangeText' | 'onBlur' | 'style'
>;

type CounterProps<InputFields extends FieldValues> = {
  name: Path<InputFields>;
  control: Control<InputFields>;
  maxLength: ValidationRule<number>;
  showError: boolean;
};

/**
 *
 * Uses React Hook Form. The name and control should come from the `useForm<T>`. More info here https://www.react-hook-form.com/get-started/#ReactNative. This component also has access to all the same props as React Native's `<TextInput/>`
 */
export const HookFormTextInput = <InputFields extends FieldValues>({
  name,
  control,
  rulesWithMessage,
  style,
  showCount,
  ...RNtextInputProps
}: TextInputProps<InputFields>) => {
  const {formatMessage} = useIntl();
  const errors = useFormState({control}).errors;
  const errorType =
    errors && errors[name] && errors[name]?.type
      ? (errors[name]?.type as keyof RulesWithMessage)
      : undefined;

  const errorMessage =
    errorType && rulesWithMessage
      ? rulesWithMessage[errorType]?.message
      : undefined;

  const maxLength = rulesWithMessage && rulesWithMessage['maxLength']?.value;

  const rules = transformRules(rulesWithMessage);
  return (
    <React.Fragment>
      <View style={[styles.input, style, errorType ? styles.error : {}]}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field: {value, onChange, onBlur}}) => (
            <RNTextInput
              style={[{flex: 1, color: BLACK}]}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor={LIGHT_GREY}
              {...RNtextInputProps}
            />
          )}
        />
        {errorType && <ErrorIcon style={{position: undefined}} color={RED} />}
      </View>
      <View
        style={[
          styles.underContainer,
          {justifyContent: !errorMessage ? 'flex-end' : 'space-between'},
        ]}>
        {errorMessage && (
          <Text style={{color: RED}}>{formatMessage(errorMessage)}</Text>
        )}
        {maxLength && showCount && (
          <Counter
            showError={errorType === 'maxLength'}
            control={control}
            name={name}
            maxLength={maxLength}
          />
        )}
      </View>
    </React.Fragment>
  );
};

// Utility function to transform rulesWithMessage to the correct type
function transformRules(
  rawRules?: RulesWithMessage,
): RegisterOptions | undefined {
  return rawRules
    ? Object.fromEntries(
        Object.entries(rawRules).map(([key, rule]) => [key, rule?.value]),
      )
    : undefined;
}

const Counter = <InputFields extends FieldValues>({
  maxLength,
  control,
  name,
  showError,
}: CounterProps<InputFields>) => {
  const watcher = useWatch({control, name});
  const inputCount = watcher?.length || 0;
  const highlightError = showError && inputCount > maxLength;

  return (
    <Text
      style={[
        {color: highlightError ? RED : LIGHT_GREY},
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
