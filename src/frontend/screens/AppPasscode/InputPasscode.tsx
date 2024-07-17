import * as React from 'react';
import {defineMessages, FormattedMessage, MessageDescriptor} from 'react-intl';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useBlurOnFulfill} from 'react-native-confirmation-code-field';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {WHITE, RED, COMAPEO_BLUE} from '../../lib/styles';
import {Button} from '../../sharedComponents/Button';
import {CELL_COUNT, PasscodeInput} from '../../sharedComponents/PasscodeInput';
import {Text} from '../../sharedComponents/Text';
import {ConfirmPasscodeSheet} from './ConfirmPasscodeSheet';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal';

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
  text: {
    title: MessageDescriptor;
    subtitle: MessageDescriptor;
    errorMessage: MessageDescriptor;
  };
  validate: (pass: string) => void | boolean;
  showPasscodeValues?: boolean;
  error: boolean;
  hideError: () => void;
  showNext?: boolean;
}

export const InputPasscode = ({
  validate,
  text,
  showPasscodeValues,
  error,
  hideError,
  showNext = true,
}: InputPasscodeProps) => {
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
    <React.Fragment>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Text style={[styles.header]}>
              <FormattedMessage {...text.title} />
            </Text>
            <Text style={[styles.subtext]}>
              <FormattedMessage {...text.subtitle} />
            </Text>

            <PasscodeInput
              error={error}
              ref={inputRef}
              inputValue={inputValue}
              onChangeTextWithValidation={updateInput}
              maskValues={!showPasscodeValues}
            />

            {error && (
              <Text style={styles.error}>
                <FormattedMessage {...text.errorMessage} />
              </Text>
            )}
          </View>

          <View>
            <Button
              fullWidth
              variant="outlined"
              style={{marginBottom: 20, marginTop: 20}}
              onPress={() => {
                navigate('Security');
              }}>
              <Text style={[styles.buttonText, {color: COMAPEO_BLUE}]}>
                <FormattedMessage {...m.cancel} />
              </Text>
            </Button>

            {showNext && (
              <Button
                fullWidth
                onPress={() => {
                  if (validate(inputValue)) {
                    openSheet();
                  }
                }}>
                <Text style={[styles.buttonText, {color: WHITE}]}>
                  <FormattedMessage {...m.button} />
                </Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
      <ConfirmPasscodeSheet
        inputtedPasscode={inputValue}
        ref={sheetRef}
        isOpen={isOpen}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    minWidth: 90,
    maxWidth: 280,
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtext: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    padding: 20,
    flexDirection: 'column',
    height: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
    color: RED,
  },
});
