import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useBlurOnFulfill} from 'react-native-confirmation-code-field';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {RED} from '../../lib/styles';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal';
import {Button} from '../../sharedComponents/Button';
import {CELL_COUNT, PasscodeInput} from '../../sharedComponents/PasscodeInput';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';
import {ConfirmPasscodeSheet} from './ConfirmPasscodeSheet';

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
  const {sheetRef, isOpen, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });

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

  const {navigate} = useNavigationFromRoot();

  return (
    <>
      <ScreenContentWithDock
        contentContainerStyle={styles.contentContainer}
        dockContent={
          <View style={styles.buttonsContainer}>
            <Button
              fullWidth
              variant="outlined"
              color="ComapeoBlue"
              onPress={() => {
                navigate('Security');
              }}>
              {t(m.cancel)}
            </Button>

            {showNext && (
              <Button
                fullWidth
                onPress={() => {
                  if (validate(inputValue)) {
                    openSheet();
                  }
                }}>
                {t(m.button)}
              </Button>
            )}
          </View>
        }>
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.subtext}>{subtitle}</Text>

        <PasscodeInput
          testID="SETTINGS.passcode-inp"
          error={error}
          ref={inputRef}
          inputValue={inputValue}
          onChangeTextWithValidation={updateInput}
          maskValues={!showPasscodeValues}
        />

        {error && <Text style={styles.error}>{errorMessage}</Text>}
      </ScreenContentWithDock>

      <ConfirmPasscodeSheet
        inputtedPasscode={inputValue}
        ref={sheetRef}
        isOpen={isOpen}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
  },
  header: {
    fontSize: 32,
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 20,
  },
  subtext: {
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    color: RED,
  },
});
