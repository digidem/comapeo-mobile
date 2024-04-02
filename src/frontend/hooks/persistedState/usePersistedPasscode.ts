import { StateCreator } from 'zustand'
import { createPersistedState } from './createPersistedState'

type PasscodeSlice = {
  passcode: string | null
  obscureCode: string | null
  setPasscode: (code: string | null) => void
  setObscureCode: (code?: string | null) => void
}

const passcodeSlice: StateCreator<PasscodeSlice> = (set, get) => ({
  passcode: null,
  obscureCode: null,
  setPasscode: (passcodeValue) => {
    const obscureCode = get().obscureCode
    if (passcodeValue === OBSCURE_PASSCODE) {
      throw new Error('passcode is reserved')
    }

    if (passcodeValue !== null && passcodeValue === obscureCode) {
      throw new Error('passcode is already being used obscure code')
    }
    if (!validPasscode(passcodeValue)) {
      throw new Error('passcode not valid')
    }

    if (passcodeValue === null) {
      set({ passcode: null, obscureCode: null })
      return
    }

    set({ passcode: passcodeValue })
  },
  setObscureCode: (newObscureVal) => {
    const passcode = get().passcode
    if (passcode === null && newObscureVal !== null) {
      throw new Error('Cannot set obscure mode if passcode not set')
    }
    if (newObscureVal === undefined) {
      set({ obscureCode: OBSCURE_PASSCODE })
      return
    }
    if (!validPasscode(newObscureVal) || newObscureVal === passcode) {
      throw new Error('passcode not valid')
    }
    set({ obscureCode: newObscureVal })
  },
})

export const usePersistedPasscode = createPersistedState(
  passcodeSlice,
  'Passcode',
)

const OBSCURE_PASSCODE = '00000'

function validPasscode(passcode: string | null): boolean {
  if (passcode === null) return true
  return passcode.length === 5 && !isNaN(parseInt(passcode, 10))
}
