import {useEffect, useState} from 'react';
import {
  useSecurityActions,
  useSecurityState,
} from '../contexts/SecurityStoreContext';
import {getRemainingLockoutMinutes} from '../lib/security';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  lockoutMessage: {
    id: 'hooks.usePasscodeLockout.lockoutMessage',
    defaultMessage:
      'Try again in {minutes, plural, one {# minute} other {# minutes}}',
  },
});

export function usePasscodeLockout() {
  const {lockUntil} = useSecurityState();
  const {setLockout} = useSecurityActions();
  const [minutes, setMinutes] = useState(0);
  const {formatMessage} = useIntl();

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (lockUntil) {
      const calcMinutes = getRemainingLockoutMinutes(lockUntil);
      setMinutes(calcMinutes);
      timeout = setTimeout(() => {
        setLockout(0);
      }, calcMinutes * 60_000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [lockUntil, setLockout]);

  return {
    isLockedOut: !!lockUntil,
    message: formatMessage(m.lockoutMessage, {minutes}),
  };
}
