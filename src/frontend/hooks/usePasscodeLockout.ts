import {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useSecurityState} from '../contexts/SecurityStoreContext';
import {getRemainingLockoutMinutes} from '../lib/security';

export function usePasscodeLockout(message: {
  id: string;
  defaultMessage: string;
}) {
  const {lockUntil} = useSecurityState();
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null);
  const {formatMessage} = useIntl();

  useEffect(() => {
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
    setLockoutMessage(formatMessage(message, {minutes}));

    const timeout = setTimeout(() => {
      setIsLockedOut(false);
      setLockoutMessage(null);
    }, minutes * 60_000);

    return () => clearTimeout(timeout);
  }, [lockUntil, formatMessage, message]);

  return {isLockedOut, lockoutMessage};
}
