import {digits, length, notValue, pipe, string} from 'valibot';

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
  if (attempts === 5) return 1;
  if (attempts === 7) return 3;
  if (attempts >= 8) return 5;

  return 0;
}
