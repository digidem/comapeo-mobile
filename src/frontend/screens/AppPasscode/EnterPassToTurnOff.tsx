import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {useAuthContext} from '../../contexts/AuthContext';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {InputPasscode} from './InputPasscode';
import {useSecurityState} from '../../contexts/SecurityStoreContext';

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
  const {authenticate} = useAuthContext();
  const [error, setError] = React.useState(false);
  const {navigate} = navigation;

  // Stops user from accessing this page if no password is set
  React.useLayoutEffect(() => {
    if (passcode === null) {
      navigate('Security');
    }
  }, [navigate, passcode]);

  function validate(passcode: string) {
    if (!authenticate(passcode, true)) {
      setError(true);
      return;
    }
    navigate('DisablePasscode');
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
