import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useBlurOnFulfill} from 'react-native-confirmation-code-field';

import {useAuthContext} from '../../contexts/AuthContext';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {useSecurityState} from '../../contexts/SecurityStoreContext';
import {getRemainingLockoutMinutes} from '../../lib/security';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PasscodeInput, CELL_COUNT} from '../../sharedComponents/PasscodeInput';
import ClockIcon from '../../images/ClockOutlined.svg';
import {BLACK, RED} from '../../lib/styles';

const m = defineMessages({
  titleEnter: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.titleEnter',
    defaultMessage: 'Enter Passcode',
  },
  passwordError: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordError',
    defaultMessage: 'Incorrect Passcode',
  },
  title: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.title',
    defaultMessage: 'Confirm Passcode',
  },
  lockoutMessage: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.lockoutMessage',
    defaultMessage:
      'Try again in {minutes, plural, one {# minute} other {# minutes}}',
  },
});

export const EnterPassToTurnOff: NativeNavigationComponent<
  'EnterPassToTurnOff'
> = ({navigation}) => {
  const {formatMessage: t} = useIntl();
  const passcode = useSecurityState(state => state.passcode);
  const {lockUntil} = useSecurityState();
  const {authenticate} = useAuthContext();
  const [error, setError] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isLockedOut, setIsLockedOut] = React.useState(false);
  const [lockoutMessage, setLockoutMessage] = React.useState<string | null>(
    null,
  );

  const inputRef = useBlurOnFulfill({value: inputValue, cellCount: CELL_COUNT});

  // Stops user from accessing this page if no password is set
  React.useLayoutEffect(() => {
    if (passcode === null) {
      navigation.navigate('Security');
    }
  }, [navigation, passcode]);

  React.useEffect(() => {
    if (!lockUntil) {
      setIsLockedOut(false);
      setLockoutMessage(null);
      return;
    }

    const minutes = getRemainingLockoutMinutes(lockUntil);
    if (minutes <= 0) {
      setIsLockedOut(false);
      setLockoutMessage(null);
      return;
    }

    setIsLockedOut(true);
    setLockoutMessage(t(m.lockoutMessage, {minutes}));

    const timeout = setTimeout(() => {
      setIsLockedOut(false);
      setLockoutMessage(null);
    }, minutes * 60000);

    return () => clearTimeout(timeout);
  }, [lockUntil, t]);

  function updateInput(newVal: string) {
    if (error) setError(false);
    setInputValue(newVal);
    if (newVal.length === 5) validate(newVal);
  }

  function validate(passcode: string) {
    try {
      const valid = authenticate(passcode, true);

      if (valid) {
        navigation.navigate('DisablePasscode');
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
      if (e instanceof Error && e.message === 'LOCKED_OUT') {
        const minutes = getRemainingLockoutMinutes(lockUntil);
        setLockoutMessage(t(m.lockoutMessage, {minutes}));
      } else {
        setLockoutMessage(null);
      }
    }
  }

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.container}
      dockContent={
        error && (
          <HeaderText variant="header5" style={styles.error}>
            {t(m.passwordError)}
          </HeaderText>
        )
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
        ref={inputRef}
        inputValue={inputValue}
        onChangeTextWithValidation={updateInput}
        error={error}
        editable={!isLockedOut}
      />
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
