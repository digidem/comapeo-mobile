import {useEffect, useMemo} from 'react';
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
  const {setLockUntil} = useSecurityActions();
  const {formatMessage} = useIntl();

  const minutes = useMemo(() => {
    if (!lockUntil) return 0;
    return getRemainingLockoutMinutes(lockUntil);
  }, [lockUntil]);

  useEffect(() => {
    if (!lockUntil || minutes === 0) return;

    const timeout = setTimeout(() => {
      setLockUntil(0);
    }, minutes * 60_000);

    return () => clearTimeout(timeout);
  }, [lockUntil, minutes, setLockUntil]);

  return {
    isLockedOut: !!lockUntil,
    message: formatMessage(m.lockoutMessage, {minutes}),
  };
}
