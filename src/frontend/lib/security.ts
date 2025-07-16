import {digits, length, notValue, pipe, string} from 'valibot';
import {PASSCODE_LOCKOUT_THRESHOLDS} from '../constants';
import * as Crypto from 'expo-crypto';
import * as v from 'valibot';

export const DEFAULT_OBSCURE_CODE = '00000';

export const PasscodeInputSchema = pipe(
  string(),
  length(5),
  digits(),
  notValue(DEFAULT_OBSCURE_CODE, 'Passcode is reserved'),
);

export const StoredPasscodeSchema = pipe(
  string(),
  v.minLength(80),
  v.includes(':'),
);

export function getRemainingLockoutMinutes(lockUntil: number | null): number {
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

export function generateSalt(): string {
  const bytes = Crypto.getRandomBytes(8);
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPasscode(
  passcode: string,
  salt: string,
): Promise<string> {
  const toHash = `${salt}:${passcode}`;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    toHash,
  );
  return `${salt}:${hash}`;
}

export async function verifyPasscode(
  input: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;
  const recomputed = await hashPasscode(input, salt!);
  return recomputed === `${salt}:${originalHash}`;
}
