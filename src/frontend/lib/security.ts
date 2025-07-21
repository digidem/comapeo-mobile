import {digits, length, notValue, pipe, string} from 'valibot';
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

export function generateSalt(): string {
  const bytes = Crypto.getRandomBytes(8);
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPasscode({
  passcode,
  salt,
}: {
  passcode: string;
  salt: string;
}): Promise<string> {
  const toHash = `${salt}:${passcode}`;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    toHash,
  );
  return `${salt}:${hash}`;
}

export async function verifyPasscode({
  input,
  stored,
}: {
  input: string;
  stored: string;
}): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts as [string, string];

  const recomputed = await hashPasscode({passcode: input, salt});
  return recomputed === `${salt}:${originalHash}`;
}
