import {digits, length, notValue, pipe, string} from 'valibot';
import {PASSCODE_LOCKOUT_THRESHOLDS} from '../constants';

export const DEFAULT_OBSCURE_CODE = '00000';

export const PasscodeSchema = pipe(
  string(),
  length(5),
  digits(),
  notValue(DEFAULT_OBSCURE_CODE, 'Passcode is reserved'),
);

export function getRemainingLockoutMinutes(lockUntil: number): number {
  if (!lockUntil) return 0;
  const msRemaining = lockUntil - Date.now();
  return msRemaining > 0 ? Math.ceil(msRemaining / 60000) : 0;
}

export function getLockoutThreshold(attempts: number): number | null {
  const match = PASSCODE_LOCKOUT_THRESHOLDS.find(
    t => t.attempts === attempts || (attempts > 8 && t.attempts === 8),
  );
  return match ? match.minutes : null;
}
