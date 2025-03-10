export const DEFAULT_OBSCURE_CODE = '00000';

export function isValidPasscode(passcode: string): boolean {
  // Matches when there are exactly 5 characters and all of them are digits
  return /^[0-9]{5}$/.test(passcode);
}
