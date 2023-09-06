import {StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

export function usePersistedPasscode() {
  const passcode = usePersistedPasscodeNoValidation(store => store.passcode);
  return [passcode, setPasscodeWithValidation] as const;
}

export function usePersistedObscureCode() {
  const obscureCode = usePersistedPasscodeNoValidation(
    store => store.obscureCode,
  );
  return [obscureCode, setObscureCodeWithValidation] as const;
}

type PasscodeSlice = {
  passcode: string | null;
  obscureCode: string | null;
  setPasscode: (code: string | null) => void;
  setObscureCode: (code: string | null) => void;
};

const passcodeSlice: StateCreator<PasscodeSlice> = (set, get) => ({
  passcode: null,
  obscureCode: null,
  setPasscode: code => set({passcode: code}),
  setObscureCode: code => set({obscureCode: code}),
});

const usePersistedPasscodeNoValidation = createPersistedState(
  passcodeSlice,
  'Passcode',
);

const OBSCURE_PASSCODE = '00000';

function setPasscodeWithValidation(passcodeValue: string | null) {
  const [obscureCode, setObscureCode] = usePersistedPasscodeNoValidation(
    state => [state.obscureCode, state.setObscureCode],
  );
  const setPasscode = usePersistedPasscodeNoValidation(
    state => state.setPasscode,
  );

  if (passcodeValue === OBSCURE_PASSCODE) {
    throw new Error('passcode is reserved');
  }

  if (passcodeValue !== null && passcodeValue === obscureCode) {
    throw new Error('passcode is already being used obscure code');
  }

  if (!validPasscode(passcodeValue)) {
    throw new Error('passcode not valid');
  }

  if (passcodeValue === null) {
    setObscureCode(null);
    setPasscode(passcodeValue);
    //  FlagSecureModule.deactivate();
    return;
  }

  //   FlagSecureModule.activate();
  setPasscode(passcodeValue);
}

const setObscureCodeWithValidation = (newObscureVal?: string | null) => {
  const setObscureCode = usePersistedPasscodeNoValidation(
    state => state.setObscureCode,
  );
  const passcode = usePersistedPasscodeNoValidation(state => state.passcode);

  if (passcode === null && newObscureVal !== null) {
    throw new Error('Cannot set obscure mode if passcode not set');
  }

  if (newObscureVal === undefined) {
    setObscureCode(OBSCURE_PASSCODE);
    return;
  }

  if (!validPasscode(newObscureVal) || newObscureVal === passcode) {
    throw new Error('passcode not valid');
  }

  setObscureCode(newObscureVal);
};

function validPasscode(passcode: string | null): boolean {
  if (passcode === null) return true;
  return passcode.length === 5 && !isNaN(parseInt(passcode, 10));
}
