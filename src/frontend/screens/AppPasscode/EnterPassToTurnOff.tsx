import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {InputPasscode} from './InputPasscode';
import {useSecurityState} from '../../contexts/SecurityStoreContext';
import {verifyPasscode} from '../../lib/security';

const m = defineMessages({
  titleEnter: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.titleEnter',
    defaultMessage: 'Enter Passcode',
  },
  subTitleEnter: {
    id: 'screens.AppPasscode.EnterPassToTurnOff.subTitleEnter',
    defaultMessage: 'Please Enter Passcode',
  },
  passwordError: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordError',
    defaultMessage: 'Incorrect Passcode',
  },
  title: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.title',
    defaultMessage: 'Confirm Passcode',
  },
});

export const EnterPassToTurnOff: NativeNavigationComponent<
  'EnterPassToTurnOff'
> = ({navigation}) => {
  const {formatMessage: t} = useIntl();
  const passcode = useSecurityState(state => state.passcode);
  const [error, setError] = React.useState(false);
  const {navigate} = navigation;

  // Stops user from accessing this page if no password is set
  React.useLayoutEffect(() => {
    if (passcode === null) {
      navigate('Security');
    }
  }, [navigate, passcode]);

  function validate(passcodeValue: string): void {
    if (!passcode) return;

    verifyPasscode({input: passcodeValue, stored: passcode}).then(success => {
      if (!success) {
        setError(true);
        return;
      }
      navigation.navigate('DisablePasscode');
    });
  }
  return (
    <InputPasscode
      title={t(m.titleEnter)}
      subtitle={t(m.subTitleEnter)}
      errorMessage={t(m.passwordError)}
      error={error}
      validate={validate}
      showNext={false}
      hideError={() => setError(false)}
    />
  );
};

EnterPassToTurnOff.navTitle = m.title;
