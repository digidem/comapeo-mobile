import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {OBSCURE_PASSCODE} from '../../constants';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {InputPasscode} from './InputPasscode';

const m = defineMessages({
  titleSet: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleSet',
    defaultMessage: 'Set App Passcode',
  },
  initialPassError: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.initialPassError',
    defaultMessage: 'Password must be 5 numbers',
  },
  titleConfirm: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.TitleConfirm',
    defaultMessage: 'Re-enter Passcode',
  },
  subTitleSet: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.subTitleSet',
    defaultMessage: 'This passcode will be required to open the CoMapeo App',
  },
  passwordDoesNotMatch: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.passwordDoesNotMatch',
    defaultMessage: 'Password does not match',
  },
  obscurePasscodeError: {
    id: 'screens.AppPasscode.NewPasscode.InputPasscodeScreen.obscurePasscodeError',
    defaultMessage: 'Cannot be used as a Passcode',
  },
  title: {
    id: 'screens.AppPasscode.NewPasscode.SetPasscodeScreen.title',
    defaultMessage: 'Set Passcode',
  },
});

type SetPasswordError =
  | {
      error: true;
      isObscurePassword: boolean;
    }
  | {error: false; isObscurePassword: false};

export const SetPasscode: NativeNavigationComponent<'SetPasscode'> = () => {
  const {formatMessage: t} = useIntl();
  const [error, setError] = React.useState<SetPasswordError>({
    error: false,
    isObscurePassword: false,
  });
  const [initialPass, setInitialPass] = React.useState('');
  const [isConfirming, setIsConfirming] = React.useState(false);

  function hideError() {
    setError({error: false, isObscurePassword: false});
  }

  function validate(inputVal: string) {
    if (inputVal === OBSCURE_PASSCODE) {
      setError({error: true, isObscurePassword: true});
      setInitialPass('');
      return;
    }

    if (inputVal.length < 5) {
      setError({error: true, isObscurePassword: false});
      return;
    }

    setInitialPass(inputVal);
    setIsConfirming(true);
  }

  if (!isConfirming) {
    return (
      <InputPasscode
        title={t(m.titleSet)}
        subtitle={t(m.subTitleSet)}
        errorMessage={t(
          error.isObscurePassword ? m.obscurePasscodeError : m.initialPassError,
        )}
        validate={validate}
        error={error.error}
        showPasscodeValues={true}
        hideError={hideError}
      />
    );
  }

  return <SetPasswordConfirm initialPass={initialPass} />;
};

SetPasscode.navTitle = m.title;

const SetPasswordConfirm = ({initialPass}: {initialPass: string}) => {
  const {formatMessage: t} = useIntl();

  const [error, setError] = React.useState(false);

  function validate(inputVal: string) {
    if (inputVal === initialPass) {
      return true;
    }

    setError(true);
    return false;
  }

  return (
    <InputPasscode
      title={t(m.titleConfirm)}
      subtitle={t(m.subTitleSet)}
      errorMessage={t(m.passwordDoesNotMatch)}
      validate={validate}
      error={error}
      showPasscodeValues={true}
      hideError={() => {
        setError(false);
      }}
    />
  );
};
