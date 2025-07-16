import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {useAuthContext} from '../../contexts/AuthContext';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {useSecurityState} from '../../contexts/SecurityStoreContext';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PasscodeInput} from '../../sharedComponents/PasscodeInput';
import ClockIcon from '../../images/ClockOutlined.svg';
import {BLACK, RED} from '../../lib/styles';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {usePasscodeLockout} from '../../hooks/usePasscodeLockout';

const m = defineMessages({
  titleEnter: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.titleEnter',
    defaultMessage: 'Enter Passcode',
  },
  passwordError: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.passwordError',
    defaultMessage: 'Incorrect Passcode',
  },
  title: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.title',
    defaultMessage: 'Confirm Passcode',
  },
  lockoutMessage: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.lockoutMessage',
    defaultMessage:
      'Try again in {minutes, plural, one {# minute} other {# minutes}}',
  },
  cancel: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.cancel',
    defaultMessage: 'Cancel',
  },
});

export const EnterPassToTurnOff: NativeNavigationComponent<
  'EnterPassToTurnOff'
> = ({navigation}) => {
  const {formatMessage: t} = useIntl();
  const passcode = useSecurityState(state => state.passcode);
  const {authenticate} = useAuthContext();
  const [error, setError] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const {isLockedOut, lockoutMessage} = usePasscodeLockout(m.lockoutMessage);

  // Stops user from accessing this page if no password is set
  React.useLayoutEffect(() => {
    if (passcode === null) {
      navigation.navigate('Security');
    }
  }, [navigation, passcode]);

  function updateInput(newVal: string) {
    if (error) setError(false);
    setInputValue(newVal);
    if (newVal.length === 5) validate(newVal);
  }

  async function validate(passcode: string) {
    try {
      const valid = await authenticate(passcode, true);

      if (valid) {
        navigation.navigate('DisablePasscode');
      } else {
        setError(true);
        setInputValue('');
      }
    } catch {
      setError(true);
      setInputValue('');
    }
  }
  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.container}
      dockContent={
        <SecondaryButton
          fullSize
          onPress={() => {
            navigation.popTo('Security');
          }}
          text={t(m.cancel)}
        />
      }>
      <HeaderText variant="header1" style={styles.header}>
        {t(m.titleEnter)}
      </HeaderText>
      {lockoutMessage && (
        <View style={styles.lockoutContainer}>
          <ClockIcon width={20} height={20} />
          <BodyText style={styles.lockoutText}>{lockoutMessage}</BodyText>
        </View>
      )}
      <PasscodeInput
        testID="SETTINGS.passcode-inp"
        inputValue={inputValue}
        onChangeTextWithValidation={updateInput}
        error={error}
        editable={!isLockedOut}
      />
      {error && (
        <HeaderText variant="header5" style={styles.error}>
          {t(m.passwordError)}
        </HeaderText>
      )}
    </ScreenContentWithDock>
  );
};

EnterPassToTurnOff.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 60,
  },
  header: {
    textAlign: 'center',
  },
  lockoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 4,
  },
  lockoutText: {
    color: BLACK,
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    color: RED,
  },
});
