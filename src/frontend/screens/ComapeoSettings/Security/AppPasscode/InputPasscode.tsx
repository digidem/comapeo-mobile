import * as React from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {useBlurOnFulfill} from 'react-native-confirmation-code-field';

import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';
import {RED} from '../../../../lib/styles';
import {
  SecondaryButton,
  PrimaryButton,
} from '../../../../sharedComponents/Buttons';
import {
  CELL_COUNT,
  PasscodeInput,
} from '../../../../sharedComponents/PasscodeInput';
import {ScreenContentWithButtonDock} from '../../../../sharedComponents/ScreenContentWithDock/ScreenContentWithButtonDock';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';

const m = defineMessages({
  button: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.button',
    defaultMessage: 'Next',
  },
  cancel: {
    id: 'screens.AppPasscode.InputPasscodeScreen.cancel',
    defaultMessage: 'Cancel',
  },
});

interface InputPasscodeProps {
  title: string;
  subtitle: string;
  errorMessage: string;
  validate: (pass: string) => void | boolean;
  showPasscodeValues?: boolean;
  error: boolean;
  hideError: () => void;
  showNext?: boolean;
}

export const InputPasscode = ({
  validate,
  title,
  subtitle,
  errorMessage,
  showPasscodeValues,
  error,
  hideError,
  showNext = true,
}: InputPasscodeProps) => {
  const {formatMessage: t} = useIntl();
  const [inputValue, setInputValue] = React.useState('');

  const inputRef = useBlurOnFulfill({
    value: inputValue,
    cellCount: CELL_COUNT,
  });

  React.useEffect(() => {
    if (error) {
      inputRef.current?.focus();
    }
  }, [error, inputRef]);

  function updateInput(newVal: string) {
    if (error) hideError();
    setInputValue(newVal);
    if (!showNext && newVal.length === 5) {
      validate(newVal);
      setInputValue('');
    }
  }

  const {popTo, navigate} = useNavigationFromRoot();

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <ScreenContentWithButtonDock
        contentContainerStyle={{gap: 20}}
        topButton={
          showNext && (
            <PrimaryButton
              fullSize
              onPress={() => {
                if (validate(inputValue)) {
                  navigate('ConfirmPasscodeSheet', {
                    passcode: inputValue,
                  });
                }
              }}
              text={t(m.button)}
            />
          )
        }

        bottomButton={
          <SecondaryButton
            fullSize
            onPress={() => {
              popTo('Security');
            }}
            text={t(m.cancel)}
          />
        }>
        <HeaderText variant="header1" style={{textAlign: 'center'}}>
          {title}
        </HeaderText>
        <BodyText style={{textAlign: 'center'}}>{subtitle}</BodyText>

        <PasscodeInput
          testID="SETTINGS.passcode-inp"
          error={error}
          ref={inputRef}
          inputValue={inputValue}
          onChangeTextWithValidation={updateInput}
          maskValues={!showPasscodeValues}
        />

        {error && (
          <HeaderText
            variant="header5"
            style={{textAlign: 'center', color: RED}}>
            {errorMessage}
          </HeaderText>
        )}
      </ScreenContentWithButtonDock>
    </KeyboardAvoidingView>
  );
};
