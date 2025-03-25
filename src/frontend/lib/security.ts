import {digits, length, notValue, pipe, string} from 'valibot';

export const DEFAULT_OBSCURE_CODE = '00000';

export const PasscodeSchema = pipe(
  string(),
  length(5),
  digits(),
  notValue(DEFAULT_OBSCURE_CODE, 'Passcode is reserved'),
);
