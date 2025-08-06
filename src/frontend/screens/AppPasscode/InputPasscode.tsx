import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useBlurOnFulfill} from 'react-native-confirmation-code-field';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {RED} from '../../lib/styles';
import {SecondaryButton, PrimaryButton} from '../../sharedComponents/Buttons';
import {CELL_COUNT, PasscodeInput} from '../../sharedComponents/PasscodeInput';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

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

  if (error) {
    inputRef.current?.focus();
    if (inputValue.length === 5) setInputValue('');
  }

  function updateInput(newVal: string) {
    if (error) hideError();
    setInputValue(newVal);
    if (!showNext && newVal.length === 5) validate(newVal);
  }

  const {popTo, navigate} = useNavigationFromRoot();

  return (
    <>
      <ScreenContentWithDock
        contentContainerStyle={styles.contentContainer}
        dockContent={
          <View style={styles.buttonsContainer}>
            <SecondaryButton
              fullSize
              onPress={() => {
                popTo('Security');
              }}
              text={t(m.cancel)}
            />

            {showNext && (
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
            )}
          </View>
        }>
        <HeaderText variant="header1" style={styles.header}>
          {title}
        </HeaderText>
        <BodyText style={styles.subtext}>{subtitle}</BodyText>

        <PasscodeInput
          testID="SETTINGS.passcode-inp"
          error={error}
          ref={inputRef}
          inputValue={inputValue}
          onChangeTextWithValidation={updateInput}
          maskValues={!showPasscodeValues}
        />

        {error && (
          <HeaderText variant="header5" style={styles.error}>
            {errorMessage}
          </HeaderText>
        )}
      </ScreenContentWithDock>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
  },
  header: {
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 20,
  },
  subtext: {
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
    color: RED,
  },
});
